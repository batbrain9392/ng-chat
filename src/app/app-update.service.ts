import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(
    private applicationRef: ApplicationRef,
    private swUpdate: SwUpdate,
    private matSnackBar: MatSnackBar
  ) {}

  init() {
    const appIsStable$ = this.applicationRef.isStable.pipe(
      first(isStable => isStable)
    );
    const everyInterval$ = interval(15 * 60 * 1000);
    const everyIntervalOnceAppIsStable$ = concat(appIsStable$, everyInterval$);
    everyIntervalOnceAppIsStable$.subscribe(() => this.checkForUpdate());
    this.watchUpdate();
  }

  private checkForUpdate() {
    if (this.swUpdate.isEnabled) {
      console.log('App update: checking...');
      this.swUpdate
        .checkForUpdate()
        .then(() => console.log('App update: check finished'))
        .catch(err => console.log('App update: check error', err));
    }
  }

  private watchUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(updateObj => {
        console.log({ updateObj });
        this.updateApp();
      });
    }
  }

  private updateApp() {
    this.swUpdate.activateUpdate().then(() =>
      this.matSnackBar
        .open('App updated. Reloading...')
        .afterDismissed()
        .subscribe(_ => document.location.reload())
    );
  }
}
