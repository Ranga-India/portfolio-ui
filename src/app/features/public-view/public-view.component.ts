import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProfileService, Profile } from '../../core/services/profile.service';
import { CardPreviewComponent } from '../card-preview/card-preview.component';

@Component({
  selector: 'app-public-view',
  standalone: true,
  imports: [CommonModule, CardPreviewComponent],
  template: `
    <div *ngIf="isLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="animate-pulse flex flex-col items-center gap-4">
        <div class="w-12 h-12 rounded-full border-4 border-gray-200 border-t-black animate-spin"></div>
        <p class="text-sm font-medium text-gray-400 tracking-wide">Loading Profile...</p>
      </div>
    </div>

    <div *ngIf="hasError" class="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 class="text-6xl font-black text-gray-200 mb-4">404</h1>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
      <p class="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or hasn't been published yet.
      </p>
      <a href="/" class="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition shadow-lg">
        Claim your own Card.io
      </a>
    </div>

    <div *ngIf="profile" class="min-h-screen w-full">
      <app-card-preview [isLiveMode]="true" [profile]="profile"></app-card-preview>
    </div>
  `
})
export class PublicViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);
  private titleService = inject(Title); // To change browser tab title

  profile: Profile | null = null;
  isLoading = true;
  hasError = false;

  ngOnInit() {
    // 1. Get the 'slug' from the URL (e.g. /p/john-doe)
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.loadProfile(slug);
      // --- TRIGGER VIEW TRACKING ---
      // We use a simple sessionStorage check to prevent counting 
      // the same user reloading the page 10 times in one session.
      const viewKey = `viewed_${slug}`;
      if (!sessionStorage.getItem(viewKey)) {
        this.profileService.trackView(slug).subscribe(() => {
           sessionStorage.setItem(viewKey, 'true');
        });
      }
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  loadProfile(slug: string) {
    this.profileService.getPublicProfile(slug).subscribe({
      next: (data) => {
        this.profile = data;
        
        // Dynamic Browser Title (e.g. "John Doe | Card.io")
        if (data.full_name) {
          this.titleService.setTitle(`${data.full_name} | Card.io`);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Profile Load Error:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}