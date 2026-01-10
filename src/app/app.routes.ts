import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { EditorComponent } from './features/editor/editor.component';
import { PublicViewComponent } from './features/public-view/public-view.component';
// import { authGuard } from './core/guards/auth.guard'; // (If you have one)

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  
  // Protected Route (Where users edit)
  { path: 'editor', component: EditorComponent }, 

  // Public Route (Where the world sees the card)
  // We use '/p/:slug' to avoid conflicts with app routes like '/login'
  { path: 'p/:slug', component: PublicViewComponent },

  // Catch-all (Redirect to Home)
  { path: '**', redirectTo: '' }
];