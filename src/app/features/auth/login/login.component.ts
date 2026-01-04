import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  auth = inject(AuthService);

  async login() {
    try {
      await this.auth.signInWithGoogle();
    } catch (error) {
      console.error('Login failed', error);
    }
  }
}