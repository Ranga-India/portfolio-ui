import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      
      <nav class="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
          <span class="font-bold text-xl tracking-tight">Card.io</span>
        </div>
        <div class="flex gap-4">
          <a routerLink="/login" class="text-sm font-medium text-gray-600 hover:text-black transition py-2">Sign In</a>
          <a routerLink="/login" class="text-sm font-bold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition shadow-lg shadow-gray-200">
            Get Started
          </a>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col md:flex-row items-center gap-16">
        
        <div class="md:w-1/2 text-center md:text-left">
          <div class="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wide mb-6">
            ✨ V 1.0 NOW LIVE
          </div>
          <h1 class="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            The only <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">link-in-bio</span>
            you need.
          </h1>
          <p class="text-lg text-gray-500 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
            Consolidate your digital identity into one stunning, shareable card. No website builders. No complex code. Just you.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <div class="relative rounded-full shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span class="text-gray-400 font-bold">card.io/</span>
              </div>
              <input type="text" placeholder="your-name" class="block w-full rounded-full border-0 py-3 pl-20 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
            </div>
            <button routerLink="/login" class="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition shadow-xl">
              Claim Link
            </button>
          </div>
          <p class="mt-4 text-xs text-gray-400 font-medium">Free forever. No credit card required.</p>
        </div>

        <div class="md:w-1/2 relative">
          <div class="absolute -top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          
          <div class="relative transform rotate-[-2deg] hover:rotate-0 transition duration-500 ease-out">
            <div class="w-80 mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
              <div class="flex flex-col items-center">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-100 mb-4">
                <h3 class="text-xl font-bold text-gray-900">Felix Designer</h3>
                <p class="text-sm text-gray-500 mb-6">Product Designer at Stripe</p>
                
                <div class="w-full space-y-3">
                  <div class="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">in</div>
                    <div class="text-sm font-bold text-gray-700">LinkedIn</div>
                  </div>
                  <div class="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                    <div class="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.6.11.82-.26.82-.57v-2.16c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .31.22.69.82.57C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    </div>
                    <div class="text-sm font-bold text-gray-700">GitHub</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      <footer class="border-t border-gray-100 py-10 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6 text-center">
           <p class="text-gray-400 text-sm">&copy; 2024 Card.io. Crafted for minimalists.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
    }
  `]
})
export class LandingComponent {}