import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async onSigninClick() {
    await this.authService.signin();
    this.router.navigateByUrl('/chat');
  }
}
