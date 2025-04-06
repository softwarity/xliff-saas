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
    this.auth.getUser().pipe(
      filter(user => !!user),
      map((user) => {
        const fileName = user.user_metadata['avatar_url'];
        const {data: {publicUrl: avatar_url}} = this.supabase.storage.from('avatars').getPublicUrl(fileName);
        if (!avatar_url) return null;
        this.avatarSubject.next(avatar_url);
        return avatar_url;
      })
    ).subscribe();
  }

  updateAvatar(file: File): Observable<string> {
    return this.auth.getUser().pipe(
      filter(user => !!user),
      mergeMap(user => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;
        return from(this.supabase.storage.from('avatars').upload(fileName, file, { upsert: true })).pipe(
          mergeMap(({ error: uploadError, data }: { error: StorageError | null, data: { id: string; path: string; fullPath: string } | null}) => {
            console.log(data?.path);
            if (uploadError) throw uploadError;
            return from(this.supabase.auth.updateUser({data: { avatar_url: data?.path}})).pipe(
              map(() => data?.path!)
            );
          })
        );
      }),
      map((fileName: string) => {
        const {data: {publicUrl: avatar_url}} = this.supabase.storage.from('avatars').getPublicUrl(fileName);
        this.avatarSubject.next(avatar_url);
        return avatar_url;
      })
    );
  }

}