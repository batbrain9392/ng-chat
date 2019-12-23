import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppUpdateService } from './app-update.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(private appUpdateService: AppUpdateService) {}

  ngOnInit() {
    this.appUpdateService.init();
  }
}
