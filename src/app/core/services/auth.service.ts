import { Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  // Observable to track user state across the app
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser.asObservable();

  constructor(private router: Router, private ngZone: NgZone) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // 1. Check initial session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.setUser(session);
    });

    // 2. Listen for auth changes (Login, Logout, Auto-refresh)
    this.supabase.auth.onAuthStateChange((_event, session) => {
      // Supabase runs outside Angular's zone, we must re-enter to update UI
      this.ngZone.run(() => {
        this.setUser(session);
      });
    });
  }

  private setUser(session: Session | null) {
    if (session?.user) {
      this._currentUser.next(session.user);
    } else {
      this._currentUser.next(null);
    }
  }

  async signInWithGoogle() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard` // Redirect back to our app
      }
    });
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }

  // Helper to get the JWT token for our Backend API calls
  async getAccessToken(): Promise<string | undefined> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token;
  }

  getCurrentUserValue(): User | null {
    return this._currentUser.value;
  }
}