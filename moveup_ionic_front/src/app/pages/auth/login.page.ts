
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonText, IonList, IonToast, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

/**
 * Pantalla de inicio de sesión.
 */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonInput, IonItem, IonLabel, IonText, IonList, IonToast, IonSpinner, RouterLink],
  template: `


  <ion-content class="login-content">
    <section class="login-shell">
      <article class="login-showcase">
        <div class="showcase-overlay"></div>
        <div class="showcase-copy">
          <div class="brand-row">
            <img src="/assets/Logo%20app.png" alt="Logo de MoveUp" class="brand-logo" />
            <div>
              <div class="brand-name">MoveUp</div>
              <div class="brand-subtitle">Salud digital orientada al ODS 3</div>
            </div>
          </div>

          <span class="showcase-badge">Aplicación web contra el sedentarismo</span>
          <h1>Evalúa tu nivel de actividad física y conviértelo en acción.</h1>
          <p>
            Accede a cuestionarios, contenido educativo, rutinas y seguimiento desde una experiencia
            pensada para informar, orientar y acompañar hábitos saludables.
          </p>

          <ul class="showcase-points">
            <li>Cuestionario IPAQ con resultados claros.</li>
            <li>Artículos y secciones informativas.</li>
            <li>Rutinas, progreso y favoritos personalizados.</li>
          </ul>

          <div class="showcase-footer">
            <a routerLink="/" class="showcase-link"> Ver presentación de la app</a>
          </div>
        </div>
      </article>

      <article class="login-card">
        <div class="login-card-head">
          <span class="login-kicker">Acceso seguro</span>
          <h2>Bienvenido de nuevo</h2>
          <ion-text color="medium">Ingresa con tu usuario para continuar con tu experiencia MoveUp.</ion-text>
        </div>

        <ion-list class="login-form-list">
          <ion-item class="login-item">
            <ion-label position="stacked">Usuario</ion-label>
            <ion-input [(ngModel)]="username" autocomplete="username"></ion-input>
          </ion-item>
          <ion-item class="login-item">
            <ion-label position="stacked">Contraseña</ion-label>
            <ion-input [(ngModel)]="password" type="password" autocomplete="current-password"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" class="login-submit" (click)="onLogin()" [disabled]="loading">
          <ion-spinner *ngIf="loading" name="crescent" style="margin-right:8px;"></ion-spinner>
          Entrar a MoveUp
        </ion-button>

        <div class="login-links-row">
          <a routerLink="/auth/forgot">¿Olvidaste tu contraseña?</a>
          <a routerLink="/auth/register">Crear cuenta</a>
        </div>

        <div class="login-divider"></div>

        <div class="login-support">
          <p>Primera vez aquí? Explora la página de presentación antes de entrar.</p>
          <a routerLink="/" class="secondary-link">Ir a la página principal</a>
        </div>
      </article>

      <ion-toast [isOpen]="toastOpen" [message]="toastMsg" (didDismiss)="toastOpen=false" duration="2200"></ion-toast>
    </section>
  </ion-content>
  `,
  styles: [`
    :host {
      --login-bg-1: #081529;
      --login-bg-2: #12345c;
      --login-accent: #39c6aa;
      --login-soft: #edf4ff;
      --login-border: rgba(19, 52, 92, 0.12);
      --login-text: #0f1f38;
      --login-text-soft: #5f738e;
    }


    .login-content {
      --background: linear-gradient(135deg, #071527 0%, #0d2445 45%, #143865 100%);
    }

    .login-shell {
      min-height: 100%;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 26px;
      align-items: stretch;
      max-width: 1240px;
      margin: 0 auto;
      padding: 28px 18px 30px;
    }

    .login-showcase,
    .login-card {
      position: relative;
      overflow: hidden;
      border-radius: 30px;
      min-height: 620px;
      box-shadow: 0 24px 55px rgba(5, 14, 28, 0.25);
    }

    .login-showcase {
      background:
        radial-gradient(circle at top right, rgba(57, 198, 170, 0.25), transparent 26%),
        linear-gradient(160deg, rgba(8, 21, 41, 0.96), rgba(18, 52, 92, 0.92)),
        url('/assets/images/imagen1.png') center/cover no-repeat;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
    }

    .showcase-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(8, 21, 41, 0.32), rgba(8, 21, 41, 0.72));
    }

    .showcase-copy {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 30px;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }

    .brand-logo {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      object-fit: cover;
      background: rgba(255,255,255,0.95);
      padding: 5px;
      box-shadow: 0 14px 32px rgba(0,0,0,0.22);
    }

    .brand-name {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .brand-subtitle {
      color: rgba(255,255,255,0.78);
      font-size: 0.85rem;
    }

    .showcase-badge,
    .login-kicker {
      display: inline-flex;
      width: fit-content;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.03em;
    }

    .showcase-badge {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.14);
      backdrop-filter: blur(10px);
      margin-bottom: 18px;
    }

    .showcase-copy h1 {
      margin: 0;
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      line-height: 1.02;
      letter-spacing: -0.04em;
      max-width: 10ch;
      color: #ffffff;
      text-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
    }

    .showcase-copy p {
      margin: 18px 0 0;
      max-width: 58ch;
      color: rgba(255,255,255,0.92);
      line-height: 1.75;
      font-size: 1rem;
      text-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
    }

    .showcase-points {
      list-style: none;
      padding: 0;
      margin: 28px 0 0;
      display: grid;
      gap: 14px;
    }

    .showcase-points li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 18px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(8px);
      color: rgba(255,255,255,0.92);
    }

    .showcase-points li::before {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--login-accent);
      box-shadow: 0 0 0 6px rgba(57, 198, 170, 0.16);
      flex-shrink: 0;
    }

    .showcase-footer {
      margin-top: auto;
      padding-top: 22px;
    }

    .showcase-link,
    .login-links-row a,
    .secondary-link {
      text-decoration: none;
      font-weight: 700;
    }

    .showcase-link {
      color: white;
    }

    .login-card {
      background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,249,255,0.98));
      border: 1px solid rgba(255,255,255,0.3);
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .login-card-head {
      margin-bottom: 18px;
    }

    .login-kicker {
      background: rgba(18, 52, 92, 0.08);
      color: #1a4780;
      margin-bottom: 14px;
    }

    .login-card h2 {
      margin: 0 0 8px;
      color: var(--login-text);
      font-size: 2rem;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }

    .login-form-list {
      background: transparent;
      margin-bottom: 14px;
    }

    .login-item {
      --background: rgba(255,255,255,0.94);
      --border-color: rgba(19, 52, 92, 0.08);
      --padding-top: 8px;
      --padding-bottom: 8px;
      border: 1px solid var(--login-border);
      border-radius: 18px;
      margin-bottom: 14px;
      box-shadow: 0 12px 24px rgba(19, 52, 92, 0.05);
    }

    .login-submit {
      margin-top: 8px;
    }

    .login-submit::part(native) {
      background: linear-gradient(135deg, #183d6f, #2d73d5);
      min-height: 52px;
      border-radius: 16px;
      box-shadow: 0 16px 32px rgba(24, 61, 111, 0.24);
      font-weight: 700;
      letter-spacing: 0.01em;
    }

    .login-links-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .login-links-row a,
    .secondary-link {
      color: #255aa6;
    }

    .login-divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(19, 52, 92, 0), rgba(19, 52, 92, 0.16), rgba(19, 52, 92, 0));
      margin: 20px 0;
    }

    .login-support p {
      margin: 0 0 10px;
      color: var(--login-text-soft);
      line-height: 1.7;
    }

    @media (max-width: 960px) {
      .login-shell {
        grid-template-columns: 1fr;
      }

      .login-showcase,
      .login-card {
        min-height: auto;
      }

      .showcase-copy h1 {
        max-width: none;
      }

      .showcase-copy {
        min-height: 420px;
      }
    }

    @media (max-width: 560px) {
      .login-shell {
        padding: 14px 12px 18px;
      }

      .showcase-copy,
      .login-card {
        padding: 20px;
      }

      .brand-row {
        align-items: flex-start;
      }

      .showcase-copy {
        min-height: 360px;
      }

      .showcase-copy h1 {
        font-size: 2.1rem;
      }

      .showcase-points li {
        padding: 12px 14px;
      }

      .login-links-row {
        flex-direction: column;
      }
    }
  `]
})
/**
 * Componente standalone del inicio de sesión.
 *
 * Contiene la validación básica del formulario, el disparo de autenticación
 * y la redirección al área protegida cuando el acceso es exitoso.
 */
export class LoginPage {
  username = '';
  password = '';
  loading = false;

  toastOpen = false;
  toastMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Valida credenciales mínimas, solicita el acceso al backend y redirige al inicio interno.
   */
  async onLogin() {
    if (!this.username || !this.password) {
      this.toastMsg = 'Completa usuario y contraseña';
      this.toastOpen = true;
      return;
    }
    this.loading = true;
    try {
      await this.auth.loginAsync(this.username.trim(), this.password);
      await this.router.navigateByUrl('/home');
    } catch (e: any) {
      this.toastMsg = e?.error?.detail || 'No se pudo iniciar sesión';
      this.toastOpen = true;
    } finally {
      this.loading = false;
    }
  }
}
