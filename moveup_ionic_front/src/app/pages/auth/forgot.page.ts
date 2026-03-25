
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
      <ion-title>Recuperar contraseña</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="page-gradient">
    <div style="max-width: 520px; margin: 0 auto; padding: 18px;">
      <div class="card-soft" style="padding: 18px;">
        <h2 style="margin-top:0;">Te ayudamos ✅</h2>
        <ion-text color="medium">Escribe tu correo. Para este proyecto (modo dev), el backend regresará un token.</ion-text>

        <ion-list style="margin-top: 14px;">
          <ion-item>
            <ion-label position="stacked">Correo</ion-label>
            <ion-input [(ngModel)]="email" type="email" autocomplete="email"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" (click)="onRequest()" [disabled]="loading">
          <ion-spinner *ngIf="loading" name="crescent" style="margin-right:8px;"></ion-spinner>
          Solicitar token
        </ion-button>

        <div *ngIf="token" class="card-soft" style="margin-top: 14px; padding: 14px;">
          <b>Tu token (dev):</b>
          <div style="word-break: break-all; margin-top: 8px;">{{token}}</div>
          <ion-button expand="block" color="tertiary" style="margin-top: 10px;"
            [routerLink]="'/auth/reset'" [queryParams]="{ reset_token: token }">
            Continuar a cambiar contraseña
          </ion-button>
        </div>

        <div style="margin-top: 12px;">
          <a routerLink="/auth/login">Volver a login</a>
        </div>
      </div>

      <ion-toast [isOpen]="toastOpen" [message]="toastMsg" (didDismiss)="toastOpen=false" duration="2600"></ion-toast>
    </div>
  </ion-content>
  `
})
export class ForgotPage {
  email = '';
  token = '';
  loading = false;

  toastOpen = false;
  toastMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onRequest() {
    if (!this.email) {
      this.toastMsg = 'Escribe tu correo';
      this.toastOpen = true;
      return;
    }
    this.loading = true;
    try {
      const res = await this.auth.requestResetAsync(this.email.trim());
      this.token = res.reset_token;
      this.toastMsg = 'Token generado (modo dev).';
      this.toastOpen = true;
    } catch (e: any) {
      this.toastMsg = e?.error?.detail || 'No se pudo generar token';
      this.toastOpen = true;
    } finally {
      this.loading = false;
    }
  }
}
