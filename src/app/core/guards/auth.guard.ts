import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), // Take the first value and complete
    map(user => {
      if (user) {
        return true;
      }
      
      // If no user, redirect to login
      return router.createUrlTree(['/login']);
    })
  );
};