import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  portfolioService = inject(PortfolioService);
  auth = inject(AuthService);
  
  portfolios: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.portfolioService.getMyPortfolios().subscribe({
      next: (data) => {
        this.portfolios = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.auth.signOut();
  }
}