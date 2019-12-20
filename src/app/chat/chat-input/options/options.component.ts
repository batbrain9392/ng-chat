import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent {
  constructor(public authService: AuthService, private router: Router) {}

  async signout() {
    await this.authService.signout();
    this.router.navigateByUrl('/auth');
  }
}
