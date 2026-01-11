import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Profile, ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  template: `
    <div class="w-full h-full min-h-[600px] flex items-center justify-center p-4 transition-colors duration-500"
         (click)="showShareMenu = false" 
         [ngClass]="{
            'bg-slate-50': profile.theme_id === 'minimal_light',
            'bg-slate-900': profile.theme_id === 'dark_modern',
            'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400': profile.theme_id === 'glass_morphism'
         }">

      <!-- View Toggles -->
      <div class="absolute top-6 right-6 flex bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/30 shadow-lg z-50">
        <button (click)="previewMode = 'mobile'" 
                class="p-2 rounded-full transition-all group relative"
                [ngClass]="previewMode === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-medium shadow-sm">Mobile View</span>
        </button>
        <button (click)="previewMode = 'desktop'" 
                class="p-2 rounded-full transition-all group relative"
                [ngClass]="previewMode === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-medium shadow-sm">Desktop View</span>
        </button>
      </div>

      <div class="relative w-full transition-all duration-500 flex flex-col overflow-hidden"
           (click)="$event.stopPropagation()"
           [ngClass]="{
              'max-w-[340px]': previewMode === 'mobile',
              'max-w-[340px] md:max-w-4xl md:flex-row': previewMode === 'desktop',
              'bg-white shadow-xl rounded-3xl text-gray-900 border border-gray-100': profile.theme_id === 'minimal_light',
              'bg-slate-800 shadow-2xl rounded-3xl text-white border border-slate-700': profile.theme_id === 'dark_modern',
              'bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl text-white border border-white/20': profile.theme_id === 'glass_morphism'
           }">

        <div class="flex flex-col items-center text-center p-8 relative z-10"
             [ngClass]="{
                'md:items-start md:text-left md:p-12 md:w-5/12': previewMode === 'desktop',
                'md:border-r border-gray-100': profile.theme_id === 'minimal_light' && previewMode === 'desktop',
                'md:border-r border-slate-700': profile.theme_id === 'dark_modern' && previewMode === 'desktop',
                'md:border-r border-white/10': profile.theme_id === 'glass_morphism' && previewMode === 'desktop'
             }">
          
          <div class="relative mb-6 group flex justify-center" [ngClass]="{'md:justify-start': previewMode === 'desktop'}">
            <ng-container *ngIf="profile.slug && profile.is_published; else blurredQr">
              <div class="bg-white p-2 rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                   [ngClass]="profile.theme_id === 'glass_morphism' ? 'border-4 border-white/20' : 'border-4 border-white'">
                <qrcode [qrdata]="getProfileUrl()" [width]="128" [margin]="1" [errorCorrectionLevel]="'M'"></qrcode>
              </div>
            </ng-container>
            <ng-template #blurredQr>
              <div class="relative bg-white p-2 rounded-xl shadow-lg overflow-hidden"
                   [ngClass]="profile.theme_id === 'glass_morphism' ? 'border-4 border-white/20' : 'border-4 border-white'">
                <div class="blur-sm opacity-30"><qrcode qrdata="placeholder" [width]="128" [margin]="1"></qrcode></div>
                <div class="absolute inset-0 flex items-center justify-center p-2"><p class="text-[10px] font-bold text-center leading-tight text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm">Publish profile<br>to get a QR</p></div>
              </div>
            </ng-template>
          </div>

          <h1 class="text-2xl font-bold tracking-tight mb-2" [ngClass]="{'md:text-3xl': previewMode === 'desktop'}">{{ profile.full_name || 'Your Name' }}</h1>
          <p class="text-xs font-bold opacity-60 mb-3 uppercase tracking-widest">{{ profile.headline || 'Creator' }}</p>
          
          <div *ngIf="profile.location" class="flex items-center justify-center gap-2 mb-4 opacity-70 text-xs font-medium" [ngClass]="{'md:justify-start': previewMode === 'desktop'}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>{{ profile.location }}</span>
          </div>

          <div class="flex flex-wrap justify-center gap-2 mb-6" [ngClass]="{'md:justify-start': previewMode === 'desktop'}">
             <span *ngFor="let tag of profile.hashtags" 
                   class="px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide opacity-80"
                   [ngClass]="{
                     'bg-gray-100 text-gray-600': profile.theme_id === 'minimal_light',
                     'bg-slate-900 text-slate-300': profile.theme_id === 'dark_modern',
                     'bg-white/20 text-white': profile.theme_id === 'glass_morphism'
                   }">
                #{{ tag }}
             </span>
          </div>
        </div>

        <div class="flex flex-col p-8 relative z-0"
             [ngClass]="{
                'md:p-12 md:w-7/12': previewMode === 'desktop',
                'bg-gray-50/50': profile.theme_id === 'minimal_light',
                'bg-black/20': profile.theme_id === 'dark_modern' || profile.theme_id === 'glass_morphism'
             }">
          
          <p class="text-sm leading-relaxed opacity-80 mb-8 max-w-xs mx-auto" [ngClass]="{'md:max-w-none md:mx-0': previewMode === 'desktop'}">
            {{ profile.bio }}
          </p>

          <h3 class="hidden text-xs font-bold uppercase tracking-widest opacity-50 mb-6" [ngClass]="{'md:block': previewMode === 'desktop'}">Connect with me</h3>

          <div class="flex flex-wrap justify-center gap-4 mb-auto" [ngClass]="{'md:justify-start': previewMode === 'desktop'}">
            <ng-container *ngFor="let link of profile.social_links">
              <a *ngIf="link.active && link.url" [href]="link.url" target="_blank"
                 (click)="trackSocialClick(link.platform)"
                 class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 group relative focus:outline-none focus:ring-2 focus:ring-offset-2"
                 [ngClass]="{
                    'md:w-14 md:h-14': previewMode === 'desktop',
                    'bg-white shadow-sm hover:shadow-md focus:ring-gray-400': profile.theme_id === 'minimal_light',
                    'bg-slate-800 shadow-md hover:shadow-lg border border-slate-700 focus:ring-slate-500 focus:ring-offset-slate-900': profile.theme_id === 'dark_modern',
                    'bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg focus:ring-white/50 focus:ring-offset-purple-600': profile.theme_id === 'glass_morphism'
                 }">
                 
                 <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 capitalize shadow-lg font-medium">
                    View {{ link.platform }}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                 </div>

                 <ng-container [ngSwitch]="link.platform">
                    <svg *ngSwitchCase="'email'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#EA4335" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <svg *ngSwitchCase="'linkedin'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#0077B5" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <svg *ngSwitchCase="'github'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#181717" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <svg *ngSwitchCase="'twitter'" class="w-4 h-4" [ngClass]="{'md:w-5 md:h-5': previewMode === 'desktop'}" fill="#000000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <svg *ngSwitchCase="'instagram'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#E4405F" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.252-.149-4.771-1.692-4.919-4.919-.058-1.265-.071-1.644-.071-4.849 0-3.204.013-3.583.071-4.849.149-3.227 1.664-4.771 4.919-4.919zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <svg *ngSwitchCase="'tiktok'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#000000" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v10.11c0 3.21-2.48 5.8-5.7 5.8-3.21 0-5.8-2.59-5.8 5.8 0-3.21 2.59-5.8 5.8-5.8 1.77 0 3.35.77 4.43 1.99v-4.14c-1.23-.82-2.76-1.27-4.43-1.27-4.64 0-8.4 3.76-8.4 8.4 0 4.64 3.76 8.4 8.4 4.64 0 8.4-3.76 8.4-8.4V8.2c-.06-.02-.11-.04-.17-.06-1.3-.48-2.41-1.27-3.3-2.27-1.17-1.34-1.83-3.08-1.83-4.94-.01-.31-.01-.62 0-.93h-1.5z"/></svg>
                    <svg *ngSwitchCase="'facebook'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <svg *ngSwitchCase="'discord'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#5865F2" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.128 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.947 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.42-2.157 2.42z"/></svg>
                    <svg *ngSwitchCase="'twitch'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#9146FF" viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V2.571h13.714z"/></svg>
                    <svg *ngSwitchCase="'whatsapp'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#25D366" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.161 4.241 4.175-1.141zm11.397-7.909c.024-.079.057-.158.088-.238-.182-.569-1.004-1.103-1.731-1.321-.719-.216-1.534-.34-2.094-.13-.553.211-1.092.537-1.502.944-.362.363-.72.726-1.103 1.045-.219.183-.433.363-.658.534-.104-.157-.206-.317-.308-.475-.318-.525-.687-1.029-1.086-1.524-.263-.32-.514-.651-.795-.944-.186-.191-.357-.394-.547-.575.039-.124.098-.238.157-.353.136-.242.279-.486.432-.718.063-.097.117-.196.168-.301.334-.695.261-1.268-.131-1.958-.323-.567-.71-1.103-1.123-1.608-.246-.299-.495-.593-.766-.869-.313-.309-.689-.395-1.133-.246-.591.202-1.035.603-1.298 1.183-.104.23-.17.483-.177.754-.005.188.033.373.082.55.16.586.445 1.126.757 1.632.416.666.876 1.295 1.401 1.883.401.449.817.885 1.265 1.287.527.471 1.108.884 1.736 1.231.719.389 1.459.73 2.238.998.444.149.898.263 1.353.328.499.071.993.044 1.477-.086.488-.133.883-.389 1.22-.746.197-.213.382-.439.533-.685.187-.318.267-.672.252-1.042z"/></svg>
                    <svg *ngSwitchCase="'youtube'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#FF0000" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    <svg *ngSwitchCase="'medium'" class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="#000000" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm19.938 5.686l-8.6 12.623-6.838-6.522 6.663-6.101h8.775zm-16.188 6.101l-2.75 3.421v-10.153l2.75 6.732zm.781-7.236h1.75l7.568 6.917-2.181 2.062-7.137-8.979zm-1.781 10.857l2.5-3.136 5.869 5.539-8.369-2.403zm17.188 2.053l-3.25 1.039-3.75-5.461 7 4.422z"/></svg>
                    <svg *ngSwitchDefault class="w-5 h-5" [ngClass]="{'md:w-6 md:h-6': previewMode === 'desktop'}" fill="none" stroke="#666666" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                 </ng-container>
              </a>
            </ng-container>
          </div>

          <div class="mt-8 border-t pt-6 flex items-center justify-between"
               [ngClass]="{
                  'border-gray-200': profile.theme_id === 'minimal_light',
                  'border-white/10': profile.theme_id !== 'minimal_light'
               }">
            
             <button (click)="handleLike()" 
                     class="flex items-center gap-2 text-sm font-bold transition-colors group focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg p-1"
                     [ngClass]="{
                        'focus:ring-black': profile.theme_id === 'minimal_light',
                        'focus:ring-white focus:ring-offset-slate-900': profile.theme_id === 'dark_modern',
                        'focus:ring-white/50 focus:ring-offset-purple-600': profile.theme_id === 'glass_morphism',
                        'text-red-500': hasLiked,
                        'opacity-60 hover:opacity-100': !hasLiked
                     }">
                 <svg class="w-5 h-5 transition-transform group-active:scale-125" 
                      [class.fill-current]="hasLiked" 
                      [class.stroke-current]="!hasLiked"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                 <span>{{ likeCount }}</span>
             </button>

             <div class="relative">
               <button (click)="showShareMenu = !showShareMenu; $event.stopPropagation()" 
                       class="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg p-1"
                       [ngClass]="{
                          'focus:ring-black': profile.theme_id === 'minimal_light',
                          'focus:ring-white focus:ring-offset-slate-900': profile.theme_id === 'dark_modern',
                          'focus:ring-white/50 focus:ring-offset-purple-600': profile.theme_id === 'glass_morphism'
                       }">
                   <span>Share</span>
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
               </button>

               <div *ngIf="showShareMenu" 
                    class="absolute bottom-full right-0 mb-3 bg-white rounded-xl shadow-2xl p-2 flex flex-col gap-1 w-48 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200 text-gray-800">
                    <button (click)="shareToWhatsapp()" class="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg text-left text-xs font-bold transition-colors">
                        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.161 4.241 4.175-1.141zm11.397-7.909c.024-.079.057-.158.088-.238-.182-.569-1.004-1.103-1.731-1.321-.719-.216-1.534-.34-2.094-.13-.553.211-1.092.537-1.502.944-.362.363-.72.726-1.103 1.045-.219.183-.433.363-.658.534-.104-.157-.206-.317-.308-.475-.318-.525-.687-1.029-1.086-1.524-.263-.32-.514-.651-.795-.944-.186-.191-.357-.394-.547-.575.039-.124.098-.238.157-.353.136-.242.279-.486.432-.718.063-.097.117-.196.168-.301.334-.695.261-1.268-.131-1.958-.323-.567-.71-1.103-1.123-1.608-.246-.299-.495-.593-.766-.869-.313-.309-.689-.395-1.133-.246-.591.202-1.035.603-1.298 1.183-.104.23-.17.483-.177.754-.005.188.033.373.082.55.16.586.445 1.126.757 1.632.416.666.876 1.295 1.401 1.883.401.449.817.885 1.265 1.287.527.471 1.108.884 1.736 1.231.719.389 1.459.73 2.238.998.444.149.898.263 1.353.328.499.071.993.044 1.477-.086.488-.133.883-.389 1.22-.746.197-.213.382-.439.533-.685.187-.318.267-.672.252-1.042z"/></svg></div>
                        Share on WhatsApp
                    </button>
                    <button (click)="shareToEmail()" class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-left text-xs font-bold transition-colors">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div>
                        Send via Email
                    </button>
                    <button (click)="copyLink()" class="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left text-xs font-bold transition-colors">
                        <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></div>
                        Copy Link
                    </button>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CardPreviewComponent implements OnInit {
  @Input() profile!: Profile;
  
  profileService = inject(ProfileService);
  auth = inject(AuthService);
  user = toSignal(this.auth.currentUser$); 

  likeCount = 0;
  hasLiked = false;
  showShareMenu = false;
  previewMode: 'mobile' | 'desktop' = 'desktop';

  ngOnInit() {
    if (this.profile.slug) {
      this.profileService.getStats(this.profile.slug).subscribe(stats => {
        this.likeCount = stats.likes;
        this.hasLiked = stats.has_liked;
      });
    }
  }

  handleLike() {
    if (!this.user()) { 
      alert("Please login to like this card!");
      return;
    }
    const previousState = this.hasLiked;
    this.hasLiked = !this.hasLiked;
    this.likeCount += this.hasLiked ? 1 : -1;

    if (this.profile.slug) {
        this.profileService.toggleLike(this.profile.slug).subscribe({
            error: () => {
                this.hasLiked = previousState;
                this.likeCount += this.hasLiked ? 1 : -1;
            }
        });
    }
  }

  shareToWhatsapp() {
     const url = encodeURIComponent(window.location.href);
     const text = encodeURIComponent(`Check out this profile: `);
     window.open(`https://wa.me/?text=${text}${url}`, '_blank');
     this.trackShare('whatsapp');
  }

  shareToEmail() {
     const url = window.location.href;
     const subject = encodeURIComponent("Check out this profile");
     const body = encodeURIComponent(`I found this profile on Card.io:\n\n${url}`);
     window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
     this.trackShare('email');
  }

  copyLink() {
     const url = window.location.href;
     navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
     this.trackShare('copy_link');
  }

  private trackShare(platform: string) {
     this.showShareMenu = false;
     if (this.profile.slug) {
        this.profileService.trackShare(this.profile.slug, platform).subscribe();
     }
  }
  
  trackSocialClick(platform: string) {
     if (this.profile.slug) {
        this.profileService.trackShare(this.profile.slug, platform).subscribe();
     }
  }

  getProfileUrl(): string {
    return `${window.location.origin}/p/${this.profile.slug}`;
  }
}