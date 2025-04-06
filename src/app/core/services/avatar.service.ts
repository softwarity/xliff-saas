import { inject, Injectable } from '@angular/core';
import { StorageError } from '@supabase/storage-js';
import { BehaviorSubject, filter, from, map, mergeMap, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SupabaseClientService } from './supabase-client.service';
@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseClientService);
  private avatarSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  avatar$ = this.avatarSubject.asObservable();

  constructor() {
    this.auth.user$.pipe(
      filter(user => !!user),
      mergeMap(user => this.supabase.from('user_metadata').select('avatarUrl').eq('userId', user.id).single()),
      filter(response => !!response.data),
      map(({data: {avatarUrl}}: {data: {avatarUrl: string}}) => {
        if (!avatarUrl) return null;
        const { data: { publicUrl } } = this.supabase.storage.from('avatars').getPublicUrl(avatarUrl);
        this.avatarSubject.next(publicUrl);
        return publicUrl;
      })
    ).subscribe();
  }

  updateAvatar(file: File): Observable<string> {
    return this.auth.user$.pipe(
      filter(user => !!user),
      mergeMap(user => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;
        return from(this.supabase.storage.from('avatars').upload(fileName, file, { upsert: true })).pipe(
          mergeMap(({ error: uploadError, data }: { error: StorageError | null, data: { id: string; path: string; fullPath: string } | null}) => {
            if (uploadError) throw uploadError;
            return from(this.supabase.from('user_metadata').update({ avatarUrl: data!.path }).eq('userId', user.id)).pipe(
              map(() => this.supabase.storage.from('avatars').getPublicUrl(fileName))
            );
          })
        );
      }),
      map(({data: {publicUrl}}: { data: { publicUrl: string } }) => {
        this.avatarSubject.next(publicUrl);
        return publicUrl;
      })
    );
  }

}