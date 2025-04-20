import { inject, Injectable } from '@angular/core';
import { StorageError } from '@supabase/storage-js';
import { catchError, filter, from, map, mergeMap, Observable, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { ToastService } from '../../core/services/toast.service';

@Injectable()
export class AvatarService {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseClientService);
  private toastService = inject(ToastService);

  updateAvatar(file: File): Observable<string> {
    return this.auth.getUser().pipe(
      filter(user => !!user),
      mergeMap(user => {
        const fileName = `${user.id}/${file.name}`;
        return from(this.supabase.storage.from('avatars').upload(fileName, file, { upsert: true })).pipe(
          mergeMap(({ error: uploadError, data }: { error: StorageError | null, data: { id: string; path: string; fullPath: string } | null}) => {
            if (uploadError) {
              console.error('Error uploading avatar:', uploadError);
              this.toastService.error($localize `:@@AVATAR_SERVICE_ERROR_UPLOADING:Error uploading avatar`);
              return throwError(() => uploadError);
            }
            const {data: {publicUrl: avatar_url}} = this.supabase.storage.from('avatars').getPublicUrl(fileName);
            return from(this.supabase.auth.updateUser({data: { avatar_url}})).pipe(
              map(() => avatar_url),
              catchError(error => {
                console.error('Error updating user metadata:', error);
                this.toastService.error($localize `:@@AVATAR_SERVICE_ERROR_UPDATING_METADATA:Error updating user metadata`);
                return throwError(() => error);
              })
            );
          })
        );
      }),
      map((avatar_url: string) => {
        this.auth.updateAvatar(avatar_url);
        return avatar_url;
      })
    );
  }
}