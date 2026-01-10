import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
           <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Sign in to manage your digital card
        </p>
      </div>

      <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-10 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <div class="space-y-6">
            
            <button 
              (click)="login()"
              [disabled]="isLoading"
              class="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              
              <svg *ngIf="!isLoading" class="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>

              <div *ngIf="isLoading" class="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full"></div>
              
              <span>{{ isLoading ? 'Connecting...' : 'Continue with Google' }}</span>
            </button>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-100"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-400 font-medium">Secure login via Supabase</span>
              </div>
            </div>

          </div>

        </div>
        
        <p class="mt-6 text-center text-sm text-gray-500">
          Don't have an account? 
          <a routerLink="/" class="font-medium text-black hover:underline">It's auto-created on login.</a>
        </p>
      </div>

    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  isLoading = false;

  async login() {
    this.isLoading = true;
    try {
      await this.auth.signInWithGoogle();
      // No redirect logic here; Supabase will handle the redirect URL 
      // configured in the AuthService (usually back to /studio or /dashboard)
    } catch (error) {
      console.error('Login error', error);
      this.isLoading = false;
    }
  }
}