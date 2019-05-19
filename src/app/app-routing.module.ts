import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages/pages.component';

import { NonpagefoundComponent } from './shared/nonpagefound/nonpagefound.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { Graficas1Component } from './pages/graficas1/graficas1.component';

const appRoutes: Routes = [
  {
      path: '',
      component: PagesComponent,
      children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'progress', component: ProgressComponent },
          { path: 'graficas1', component: Graficas1Component },
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NonpagefoundComponent }
];

/* @NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }*/

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
