
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
      <ion-title>Crear cuenta</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="page-gradient">
    <div style="max-width: 520px; margin: 0 auto; padding: 18px;">
      <div class="card-soft" style="padding: 18px;">
        <h2 style="margin-top:0;">Empieza hoy ✨</h2>
        <ion-text color="medium">Crea tu cuenta para guardar progreso y rutinas.</ion-text>

        <ion-list style="margin-top: 14px;">
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input [(ngModel)]="first_name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Apellidos</ion-label>
            <ion-input [(ngModel)]="last_name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Usuario</ion-label>
            <ion-input [(ngModel)]="username" autocomplete="username"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Correo</ion-label>
            <ion-input [(ngModel)]="email" type="email" autocomplete="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Contraseña</ion-label>
            <ion-input [(ngModel)]="password" type="password" autocomplete="new-password"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" color="secondary" (click)="onRegister()" [disabled]="loading">
          <ion-spinner *ngIf="loading" name="crescent" style="margin-right:8px;"></ion-spinner>
          Crear cuenta
        </ion-button>

        <div style="margin-top: 12px;">
          <a routerLink="/auth/login">Ya tengo cuenta</a>
        </div>
      </div>

      <ion-toast [isOpen]="toastOpen" [message]="toastMsg" (didDismiss)="toastOpen=false" duration="2400"></ion-toast>
    </div>
  </ion-content>
  `
})
export class RegisterPage {
  first_name = '';
  last_name = '';
  username = '';
  email = '';
  password = '';
  loading = false;

  toastOpen = false;
  toastMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onRegister() {
    if (!this.username || !this.email || !this.password) {
      this.toastMsg = 'Usuario, correo y contraseña son obligatorios';
      this.toastOpen = true;
      return;
    }
    this.loading = true;
    try {
      await this.auth.registerAsync({
        first_name: this.first_name.trim(),
        last_name: this.last_name.trim(),
        username: this.username.trim(),
        email: this.email.trim(),
        password: this.password
      });
      this.toastMsg = 'Cuenta creada. Ahora inicia sesión.';
      this.toastOpen = true;
      setTimeout(() => this.router.navigateByUrl('/auth/login'), 600);
    } catch (e: any) {
      this.toastMsg = e?.error?.detail || 'No se pudo crear la cuenta';
      this.toastOpen = true;
    } finally {
      this.loading = false;
    }
  }
}
