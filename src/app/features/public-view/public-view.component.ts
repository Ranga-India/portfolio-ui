import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { DevMinimalistComponent } from '../editor/templates/dev-minimalist/dev-minimalist.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-public-view',
  standalone: true,
  imports: [CommonModule, DevMinimalistComponent],
  template: `
    <div *ngIf="isLoading" class="h-screen flex items-center justify-center bg-white">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <div *ngIf="error" class="h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 class="text-4xl font-bold text-gray-300 mb-4">404</h1>
      <p class="text-xl text-gray-600">{{ error }}</p>
      <a href="/" class="mt-8 text-blue-600 hover:underline">Go Home</a>
    </div>

    <ng-container *ngIf="portfolio">
      <app-dev-minimalist [data]="portfolio.content"></app-dev-minimalist>
    </ng-container>
  `
})
export class PublicViewComponent implements OnInit {
  route = inject(ActivatedRoute);
  portfolioService = inject(PortfolioService);
  titleService = inject(Title);

  portfolio: any = null;
  isLoading = true;
  error = '';

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadPortfolio(slug);
    }
  }

  loadPortfolio(slug: string) {
    this.portfolioService.getPublicPortfolio(slug).subscribe({
      next: (data) => {
        this.portfolio = data;
        this.isLoading = false;
        
        // SEO: Set the browser tab title
        const pageTitle = data.content.hero?.title || data.slug;
        this.titleService.setTitle(`${pageTitle} - Portfolio`);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Portfolio not found or not published.';
      }
    });
  }
}