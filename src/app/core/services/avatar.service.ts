import { inject, Injectable } from '@angular/core';
import { StorageError } from '@supabase/storage-js';
import { BehaviorSubject, catchError, filter, from, map, mergeMap, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SupabaseClientService } from './supabase-client.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseClientService);
  private toastService = inject(ToastService);
  private avatarSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  avatar$ = this.avatarSubject.asObservable();

  constructor() {
    this.auth.getUser().pipe(
      filter(user => !!user),
      map((user) => {
        const avatar_url = user.user_metadata['avatar_url'];
        if (!avatar_url) return null;
        this.avatarSubject.next(avatar_url);
        return avatar_url;
      }),
      catchError(error => {
        console.error('Error getting avatar:', error);
        this.toastService.error($localize `:@@AVATAR_SERVICE_ERROR_GETTING_AVATAR:Error getting avatar`);
        return throwError(() => error);
      })
    ).subscribe();
  }

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
        this.avatarSubject.next(avatar_url);
        return avatar_url;
      })
    );
  }
}