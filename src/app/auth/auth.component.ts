import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  isSigningIn: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  async onSigninClick() {
    this.isSigningIn = true;
    try {
      const userCredential = await this.authService.signin();
      this.matSnackBar.open(`Logged in as ${userCredential.user.displayName}`);
      this.router.navigateByUrl('/chat');
    } catch (error) {
      alert(error);
    }
  }
}
