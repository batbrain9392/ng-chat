import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { FeatureGuard } from './feature.guard';

import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AuthComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
    canLoad: [FeatureGuard],
    canActivate: [FeatureGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
