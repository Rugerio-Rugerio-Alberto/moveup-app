
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonText, IonList, IonToast, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  // CommonModule habilita *ngIf / *ngFor en componentes standalone
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonText, IonList, IonToast, IonSpinner, RouterLink],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Nuevo password</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="page-gradient">
    <div style="max-width: 520px; margin: 0 auto; padding: 18px;">
      <div class="card-soft" style="padding: 18px;">
        <h2 style="margin-top:0;">Cambia tu contraseña 🔐</h2>
        <ion-text color="medium">Pega tu token y define una nueva contraseña.</ion-text>

        <ion-list style="margin-top: 14px;">
          <ion-item>
            <ion-label position="stacked">Token</ion-label>
            <ion-input [(ngModel)]="reset_token"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Nueva contraseña</ion-label>
            <ion-input [(ngModel)]="new_password" type="password" autocomplete="new-password"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" color="tertiary" (click)="onConfirm()" [disabled]="loading">
          <ion-spinner *ngIf="loading" name="crescent" style="margin-right:8px;"></ion-spinner>
          Guardar
        </ion-button>

        <div style="margin-top: 12px;">
          <a routerLink="/auth/login">Volver a login</a>
        </div>
      </div>

      <ion-toast [isOpen]="toastOpen" [message]="toastMsg" (didDismiss)="toastOpen=false" duration="2600"></ion-toast>
    </div>
  </ion-content>
  `
})
export class ResetPage {
  reset_token = '';
  new_password = '';
  loading = false;

  toastOpen = false;
  toastMsg = '';

  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParamMap.subscribe(p => {
      const t = p.get('reset_token');
      if (t) this.reset_token = t;
    });
  }

  async onConfirm() {
    if (!this.reset_token || !this.new_password) {
      this.toastMsg = 'Token y nueva contraseña son obligatorios';
      this.toastOpen = true;
      return;
    }
    this.loading = true;
    try {
      await this.auth.confirmResetAsync(this.reset_token.trim(), this.new_password);
      this.toastMsg = 'Contraseña actualizada. Inicia sesión.';
      this.toastOpen = true;
      setTimeout(() => this.router.navigateByUrl('/auth/login'), 700);
    } catch (e: any) {
      this.toastMsg = e?.error?.detail || 'No se pudo actualizar la contraseña';
      this.toastOpen = true;
    } finally {
      this.loading = false;
    }
  }
}
