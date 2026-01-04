import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CreatePortfolioComponent } from './features/portfolio/create-portfolio/create-portfolio.component';
import { EditorComponent } from './features/editor/editor.component';
import { PublicViewComponent } from './features/public-view/public-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create', component: CreatePortfolioComponent },
  { path: 'editor/:id', component: EditorComponent },   
  { path: 'p/:slug', component: PublicViewComponent },
  // We will add 'dashboard' here later
];