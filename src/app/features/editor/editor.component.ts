import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ProfileService, Profile, SocialLink } from '../../core/services/profile.service';
import { CardPreviewComponent } from '../card-preview/card-preview.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CardPreviewComponent],
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {
  profileService = inject(ProfileService);

  isLoading = true;
  isSaving = false;
  suggestedSlugs: string[] = [];
  private nameChangeSubject = new Subject<string>();
  readonly AVAILABLE_PLATFORMS = [
    'website', 'email', 'linkedin', 'github', 'twitter', 
    'instagram', 'tiktok', 'facebook', 'youtube', 
    'discord', 'twitch', 'medium', 'whatsapp'
  ];
  // Default State to prevent null errors before API loads
  profile: Profile = {
    theme_id: 'minimal_light',
    full_name: '',
    headline: '',
    bio: '',
    is_published: false,
    social_links: [], // Will be populated by mergeSocialLinks
    hashtags: [],
    location: ''
  };

  private autoSaveSubject = new Subject<void>();

  ngOnInit() {
    this.loadProfile();
    
    // Auto-save debouncer (wait 1s after typing stops)
    this.autoSaveSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.save();
    });

    // NEW: Slug Suggestion Logic
    this.nameChangeSubject.pipe(
      debounceTime(800), // Wait 800ms after typing stops
      distinctUntilChanged(),
      switchMap(name => {
        alert('executed')
        // Don't suggest if name is empty
        if (!name) return []; 
        alert('executed')
        return this.profileService.suggestSlugs(name);
      })
    ).subscribe({
      next: (response: any) => {
        // Only show suggestions if the user doesn't have a slug yet 
        // OR if they are actively changing things.
        // For better UX, we can always show them if they aren't taken.
        this.suggestedSlugs = response.suggestions;
      },
      error: (err) => console.error(err)
    });
  }

  // Hook this up to the Full Name input
  onNameChange(newName: string) {
    this.profile.full_name = newName;
    this.triggerSave(); // existing save logic
    this.nameChangeSubject.next(newName); // trigger suggestion logic
  }

  // When user clicks a suggestion
  applySlug(slug: string) {
    this.profile.slug = slug;
    this.suggestedSlugs = []; // Clear suggestions after selection
    this.triggerSave();
  }

  onBioChange(text: string) {
    if (!text) {
      this.profile.bio = '';
      this.triggerSave();
      return;
    }
    
    const words = text.trim().split(/\s+/);
    if (words.length > 100) {
      this.profile.bio = words.slice(0, 100).join(' ');
    } else {
      this.profile.bio = text;
    }
    this.triggerSave();
  }

  loadProfile() {
    this.profileService.getMyProfile().subscribe({
      next: (data) => {
        // Merge fetched data with default structure (preserves social link order if backend is partial)
// 1. Merge basic text fields
this.profile = { ...this.profile, ...data };

// 2. CRITICAL FIX: Merge social links securely
// This ensures "unchecked" options always remain visible in the editor
this.profile.social_links = this.mergeSocialLinks(data.social_links);        
this.profile.hashtags = data.hashtags || [];
        
        console.log(this.profile.social_links)
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Called on every keystroke
  triggerSave() {
    this.isSaving = true;
    this.autoSaveSubject.next();
  }

  save() {
    console.log(this.profile)
    this.profileService.updateProfile(this.profile).subscribe({
      next: () => {
        this.isSaving = false;
      },
      error: () => this.isSaving = false
    });
  }

  toggleTheme(theme: 'minimal_light' | 'dark_modern' | 'glass_morphism') {
    this.profile.theme_id = theme;
    this.triggerSave();
  }
  
  viewPublic() {
    if(this.profile.slug) {
        window.open(`/p/${this.profile.slug}`, '_blank');
    } else {
        alert("Please set a URL slug first!");
    }
  }

  private mergeSocialLinks(savedLinks: SocialLink[] = []): SocialLink[] {
    return this.AVAILABLE_PLATFORMS.map(platform => {
      // 1. Check if the user has a saved link for this platform
      const existing = savedLinks.find(link => link.platform === platform);
      
      // 2. If yes, use it. If no, return a fresh "inactive" object.
      return existing || { platform, url: '', active: false };
    });
  }
  
  addHashtag(tag: string) {
    if (!tag) return;
  
    // 1. Initialize array if it doesn't exist (e.g. new profile)
    if (!this.profile.hashtags) {
      this.profile.hashtags = [];
    }
  
    // 2. Clean the input (remove existing #, trim spaces)
    const cleanTag = tag.replace(/#/g, '').trim();
  
    if (!cleanTag) return;
  
    // 3. Validation: Max 5 tags, and prevent duplicates
    if (this.profile.hashtags.length >= 5) {
      alert("You can only add up to 5 hashtags.");
      return;
    }
  
    if (!this.profile.hashtags.includes(cleanTag)) {
      this.profile.hashtags.push(cleanTag);
      console.log(this.profile)
      this.triggerSave(); // Save immediately
    }
  }
  
  removeHashtag(index: number) {
    this.profile.hashtags?.splice(index, 1);
    this.triggerSave();
  }

}