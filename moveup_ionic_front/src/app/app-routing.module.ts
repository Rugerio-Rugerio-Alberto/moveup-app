
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: '',
    loadComponent: () => import('./pages/public-home/public-home.page').then(m => m.PublicHomePage)
  },

  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginPage)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'auth/forgot',
    loadComponent: () => import('./pages/auth/forgot.page').then(m => m.ForgotPage)
  },
  {
    path: 'auth/reset',
    loadComponent: () => import('./pages/auth/reset.page').then(m => m.ResetPage)
  },

  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'ipaq',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/ipaq/ipaq.module').then(m => m.IPAQPageModule)
  },
  {
    path: 'articles',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/articles/articles.module').then(m => m.ArticlesPageModule)
  },
  {
    path: 'routine',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/routine/routine.module').then(m => m.RoutinePageModule)
  },
  {
    path: 'favorites',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/tab3/tab3.module').then(m => m.Tab3PageModule)
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
