import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Observable, from, switchMap, of } from 'rxjs';

export interface SocialLink {
  platform: string;
  url: string;
  active: boolean;
}

export interface Profile {
  id?: string;
  slug?: string;
  full_name?: string;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  theme_id: 'minimal_light' | 'dark_modern' | 'glass_morphism';
  social_links: SocialLink[];
  is_published: boolean;
  hashtags?: string[];
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiUrl}`; // e.g. http://localhost:8000/api

  // Helper to add Auth Headers
  private getHeaders(): Observable<HttpHeaders> {
    return from(this.auth.getAccessToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
          // Send user ID header if backend needs it explicitly
          const user = this.auth.getCurrentUserValue();
          if (user?.id) headers = headers.set('x-user-id', user.id);
        }
        return of(headers);
      })
    );
  }

  getMyProfile(): Observable<Profile> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<Profile>(`${this.apiUrl}/me`, { headers }))
    );
  }

  updateProfile(data: Partial<Profile>): Observable<Profile> {
    console.log(data)
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put<Profile>(`${this.apiUrl}/me`, data, { headers }))
    );
  }

  suggestSlugs(name: string): Observable<{ suggestions: string[] }> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.get<{ suggestions: string[] }>(
          `${this.apiUrl}/slugs/suggest?name=${encodeURIComponent(name)}`, 
          { headers }
        )
      )
    );
  }

  // Fetch a public profile (No Auth Header needed)
getPublicProfile(slug: string): Observable<Profile> {
  return this.http.get<Profile>(`${this.apiUrl}/public/${slug}`);
}

toggleLike(slug: string): Observable<{ liked: boolean }> {
  return this.getHeaders().pipe(
    switchMap(headers => this.http.post<{ liked: boolean }>(`${this.apiUrl}/public/${slug}/like`, {}, { headers }))
  );
}

getStats(slug: string): Observable<{ likes: number, has_liked: boolean }> {
  return this.getHeaders().pipe(
    switchMap(headers => this.http.get<{ likes: number, has_liked: boolean }>(`${this.apiUrl}/public/${slug}/stats`, { headers }))
  );
}

trackShare(slug: string, platform: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/public/${slug}/share`, { platform });
}

}