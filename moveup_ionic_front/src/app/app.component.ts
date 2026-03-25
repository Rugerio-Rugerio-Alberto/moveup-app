

import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnDestroy {
  isLoggedIn$: Observable<boolean>;
  private authSub: Subscription;

  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
    this.authSub = this.isLoggedIn$.subscribe((loggedIn) => {
      if (!loggedIn && !this.router.url.startsWith('/auth/')) {
        this.router.navigate(['/auth/login'], { replaceUrl: true });
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
