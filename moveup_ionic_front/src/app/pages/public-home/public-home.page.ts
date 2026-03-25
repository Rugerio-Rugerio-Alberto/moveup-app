
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

/**
 * Página pública de presentación.
 *
 * Objetivo:
 * - Dar contexto del problema del sedentarismo.
 * - Enlazar la propuesta con el ODS 3.
 * - Mostrar el valor principal de la aplicación antes del login.
 *
 * Esta pantalla es solo informativa/comercial; no consume backend.
 */
@Component({
  standalone: true,
  selector: 'app-public-home',
  imports: [CommonModule, RouterLink, IonContent, IonButton],
  template: `
    <ion-content [fullscreen]="true" class="marketing-page">
      <div class="page-shell">
        <header class="topbar">
          <a class="brand" routerLink="/">
            <img src="/assets/Logo%20app.png" alt="Logo de MoveUp" class="brand-logo" />
            <div>
              <div class="brand-name">MoveUp</div>
              <div class="brand-subtitle">Salud digital contra el sedentarismo</div>
            </div>
          </a>

          <nav class="topnav" aria-label="Navegación principal">
            <a href="#problema">Problema</a>
            <a href="#solucion">Solución</a>
            <a href="#ods">ODS 3</a>
            <a href="#funciones">Funciones</a>
          </nav>

          <div class="topbar-actions">
            <a routerLink="/auth/login" class="btn-link">Iniciar sesión</a>
            <ion-button routerLink="/auth/register" shape="round" class="btn-primary">Crear cuenta</ion-button>
          </div>
        </header>

        <main>
          <section class="hero">
            <div class="hero-copy">
              <span class="badge">ODS 3 · Salud y bienestar</span>
              <h1>Una aplicación web para comprender, evaluar y reducir el sedentarismo.</h1>
              <p class="hero-text">
                MoveUp transforma información de salud en acciones claras: explica el problema,
                evalúa el nivel de actividad física con IPAQ y orienta al usuario con hábitos,
                artículos y seguimiento.
              </p>

              <div class="hero-actions">
                <ion-button routerLink="/auth/login" shape="round" class="btn-primary hero-btn">Entrar a la app</ion-button>
                <a href="#solucion" class="btn-secondary">Conocer la propuesta</a>
              </div>

              <div class="hero-metrics">
                <article class="metric-card">
                  <strong>Evaluación</strong>
                  <span>Cuestionario IPAQ con resultados interpretables.</span>
                </article>
                <article class="metric-card">
                  <strong>Aprendizaje</strong>
                  <span>Artículos y contenido útil sobre sedentarismo.</span>
                </article>
                <article class="metric-card">
                  <strong>Seguimiento</strong>
                  <span>Rutinas, progreso y favoritos para continuidad.</span>
                </article>
              </div>
            </div>

            <div class="hero-visual" aria-hidden="true">
              <div class="visual-card visual-main">
                <div class="visual-label">MoveUp</div>
                <h2>Del diagnóstico a la acción</h2>
                <p>Informar, evaluar y acompañar hábitos saludables desde una sola experiencia web.</p>
                <img src="/assets/images/imagen1.png" alt="" />
              </div>
              <div class="visual-float float-top">Actividad física</div>
              <div class="visual-float float-bottom">Prevención</div>
            </div>
          </section>

          <section id="problema" class="info-grid">
            <article class="info-panel panel-dark">
              <p class="section-kicker">Problema</p>
              <h2>El sedentarismo afecta la salud física y el bienestar diario.</h2>
              <p>
                La app nace para responder a un contexto donde estudiar, trabajar o pasar tiempo frente a pantallas
                reduce el movimiento cotidiano y dificulta reconocer el nivel real de actividad física.
              </p>
            </article>
            <article class="info-panel panel-light">
              <p class="section-kicker">Necesidad</p>
              <h2>No basta con informar: hace falta una herramienta práctica.</h2>
              <p>
                El usuario necesita una experiencia clara para medir su situación, comprender riesgos y convertir
                ese diagnóstico en recomendaciones y acciones concretas.
              </p>
            </article>
          </section>

          <section id="solucion" class="feature-section">
            <div class="section-heading">
              <span class="badge subtle">Solución web</span>
              <h2>MoveUp integra contenido, evaluación y seguimiento en una sola plataforma.</h2>
              <p>
                La propuesta se enfoca en usuarios con estilos de vida sedentarios, especialmente estudiantes
                y jóvenes adultos que necesitan una interfaz simple para empezar a cambiar hábitos.
              </p>
            </div>

            <div class="feature-grid">
              <article class="feature-card">
                <h3>Contenido educativo</h3>
                <p>Explica causas, consecuencias y beneficios de la actividad física con secciones temáticas fáciles de explorar.</p>
              </article>
              <article class="feature-card">
                <h3>IPAQ</h3>
                <p>Permite evaluar el nivel de actividad física con un flujo guiado y resultados claros para el usuario.</p>
              </article>
              <article class="feature-card">
                <h3>Rutinas y progreso</h3>
                <p>Convierte la evaluación en acciones mediante rutinas adaptadas y seguimiento continuo.</p>
              </article>
              <article class="feature-card">
                <h3>Favoritos</h3>
                <p>Ayuda a guardar información relevante para reforzar el aprendizaje y regresar al contenido útil.</p>
              </article>
            </div>
          </section>

          <section id="ods" class="ods-section">
            <div class="ods-copy">
              <span class="badge subtle">Alineación</span>
              <h2>Contribución al ODS 3</h2>
              <p>
                La estructura de MoveUp informa, evalúa y guía al usuario hacia hábitos más activos,
                apoyando la promoción del bienestar y la prevención de riesgos asociados al sedentarismo.
              </p>
            </div>
            <div class="ods-card">
              <div class="ods-number">03</div>
              <div>
                <div class="ods-title">Salud y bienestar</div>
                <p>Diseño orientado a concientización, evaluación y acción sostenible.</p>
              </div>
            </div>
          </section>

          <section id="funciones" class="cta-band">
            <div>
              <span class="badge subtle">Explora la experiencia</span>
              <h2>Conoce el propósito de MoveUp antes de iniciar sesión.</h2>
              <p>
                Esta portada contextualiza el problema del sedentarismo, conecta la solución con el ODS 3 y prepara al usuario para entrar a la plataforma.
              </p>
            </div>
            <div class="cta-band-actions">
              <ion-button routerLink="/auth/login" shape="round" class="btn-primary hero-btn">Ir a iniciar sesión</ion-button>
              <a routerLink="/auth/register" class="text-action">Crear cuenta</a>
            </div>
          </section>
        </main>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --brand-900: #0b1f3a;
      --brand-800: #11305e;
      --brand-700: #19437e;
      --brand-600: #255aa6;
      --brand-500: #2e74d4;
      --brand-100: #eaf2ff;
      --brand-050: #f6f9ff;
      --accent: #3fd0b3;
      --text-main: #10213c;
      --text-soft: #58708f;
    }

    .marketing-page {
      --background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 45%, #f7fbff 100%);
      color: var(--text-main);
    }

    .page-shell {
      max-width: 1240px;
      margin: 0 auto;
      padding: 24px 20px 48px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 14px 18px;
      border: 1px solid rgba(17, 48, 94, 0.08);
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(10px);
      border-radius: 22px;
      position: sticky;
      top: 18px;
      z-index: 10;
      box-shadow: 0 18px 40px rgba(18, 45, 84, 0.08);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: inherit;
      text-decoration: none;
      min-width: 0;
    }

    .brand-logo {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      object-fit: cover;
      box-shadow: 0 10px 24px rgba(29, 78, 216, 0.18);
      background: white;
      padding: 4px;
    }

    .brand-name {
      font-size: 1.1rem;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .brand-subtitle {
      font-size: 0.83rem;
      color: var(--text-soft);
    }

    .topnav {
      display: flex;
      gap: 18px;
      align-items: center;
      flex-wrap: wrap;
    }

    .topnav a,
    .btn-link,
    .text-action,
    .btn-secondary {
      text-decoration: none;
      color: var(--brand-800);
      font-weight: 600;
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .btn-primary::part(native) {
      background: linear-gradient(135deg, var(--brand-700), var(--brand-500));
      color: #fff;
      box-shadow: 0 16px 32px rgba(37, 90, 166, 0.28);
      padding-inline: 18px;
    }

    .hero {
      margin-top: 34px;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 28px;
      align-items: center;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(46, 116, 212, 0.1);
      color: var(--brand-800);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      margin-bottom: 14px;
    }

    .badge.subtle {
      background: rgba(63, 208, 179, 0.14);
      color: #0f5d56;
    }

    .hero h1,
    .section-heading h2,
    .ods-copy h2,
    .cta-band h2,
    .info-panel h2 {
      margin: 0;
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    .hero h1 {
      font-size: clamp(2.3rem, 5vw, 4.35rem);
      max-width: 13ch;
    }

    .hero-text,
    .section-heading p,
    .ods-copy p,
    .cta-band p,
    .info-panel p,
    .feature-card p {
      color: var(--text-soft);
      line-height: 1.7;
      font-size: 1rem;
    }

    .hero-actions {
      margin-top: 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 0 18px;
      border-radius: 999px;
      border: 1px solid rgba(37, 90, 166, 0.18);
      background: rgba(255,255,255,0.88);
    }

    .hero-metrics,
    .feature-grid,
    .info-grid {
      display: grid;
      gap: 16px;
    }

    .hero-metrics {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-top: 28px;
    }

    .metric-card,
    .feature-card,
    .info-panel,
    .ods-card,
    .visual-main {
      border-radius: 24px;
      border: 1px solid rgba(17, 48, 94, 0.08);
      background: rgba(255, 255, 255, 0.94);
      box-shadow: 0 20px 44px rgba(17, 48, 94, 0.08);
    }

    .metric-card {
      padding: 18px;
    }

    .metric-card strong,
    .feature-card h3,
    .ods-title,
    .section-kicker {
      display: block;
      margin-bottom: 8px;
    }

    .metric-card strong,
    .feature-card h3,
    .ods-title {
      font-size: 1rem;
      color: var(--brand-900);
    }

    .metric-card span {
      color: var(--text-soft);
      line-height: 1.55;
      font-size: 0.95rem;
    }

    .hero-visual {
      position: relative;
      min-height: 560px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .visual-main {
      width: min(100%, 470px);
      padding: 28px;
      background: radial-gradient(circle at top right, rgba(63, 208, 179, 0.22), transparent 35%),
                  linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,247,255,0.98));
    }

    .visual-label {
      display: inline-block;
      background: rgba(17, 48, 94, 0.08);
      color: var(--brand-800);
      padding: 7px 12px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      margin-bottom: 14px;
    }

    .visual-main h2 {
      margin: 0 0 12px;
      font-size: 2rem;
      line-height: 1.1;
      color: var(--brand-900);
    }

    .visual-main p {
      color: var(--text-soft);
      line-height: 1.7;
      margin-bottom: 18px;
    }

    .visual-main img {
      width: 100%;
      border-radius: 20px;
      display: block;
      object-fit: cover;
      max-height: 290px;
      border: 1px solid rgba(17, 48, 94, 0.08);
    }

    .visual-float {
      position: absolute;
      padding: 12px 16px;
      border-radius: 999px;
      background: white;
      border: 1px solid rgba(17, 48, 94, 0.08);
      box-shadow: 0 18px 35px rgba(17, 48, 94, 0.10);
      font-weight: 700;
      color: var(--brand-800);
    }

    .float-top { top: 32px; right: 10px; }
    .float-bottom { bottom: 52px; left: 12px; }

    .info-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-top: 34px;
    }

    .info-panel {
      padding: 28px;
    }

    .panel-dark {
      background: linear-gradient(135deg, #0f2443, #173868);
      color: white;
    }

    .panel-dark p,
    .panel-dark .section-kicker,
    .panel-dark h2 {
      color: white;
    }

    .panel-light {
      background: rgba(255, 255, 255, 0.9);
    }

    .section-kicker {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--brand-700);
    }

    .feature-section,
    .ods-section,
    .cta-band {
      margin-top: 34px;
    }

    .section-heading {
      max-width: 760px;
      margin-bottom: 18px;
    }

    .feature-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .feature-card {
      padding: 22px;
      min-height: 190px;
    }

    .ods-section {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 18px;
      align-items: center;
      padding: 28px;
      border-radius: 28px;
      background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(234,242,255,0.92));
      border: 1px solid rgba(17, 48, 94, 0.08);
      box-shadow: 0 20px 44px rgba(17, 48, 94, 0.08);
    }

    .ods-card {
      display: flex;
      gap: 18px;
      align-items: center;
      padding: 24px;
    }

    .ods-number {
      width: 82px;
      height: 82px;
      border-radius: 24px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #2ca58d, #3fd0b3);
      color: white;
      font-size: 2rem;
      font-weight: 800;
    }

    .cta-band {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      padding: 28px;
      border-radius: 28px;
      background: linear-gradient(135deg, #0f2443, #173868 55%, #214f8d);
      color: white;
      box-shadow: 0 24px 48px rgba(17, 48, 94, 0.20);
    }

    .cta-band h2,
    .cta-band p {
      color: white;
      max-width: 650px;
    }

    .cta-band-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      min-width: 220px;
    }

    .text-action {
      color: rgba(255,255,255,0.9);
    }

    @media (max-width: 1080px) {
      .hero,
      .ods-section,
      .cta-band,
      .feature-grid,
      .info-grid,
      .hero-metrics {
        grid-template-columns: 1fr;
      }

      .hero {
        gap: 22px;
      }

      .hero-visual {
        min-height: auto;
      }

      .cta-band {
        flex-direction: column;
        align-items: flex-start;
      }

      .cta-band-actions {
        width: 100%;
      }
    }

    @media (max-width: 820px) {
      .page-shell {
        padding-inline: 14px;
      }

      .topbar {
        position: static;
        flex-direction: column;
        align-items: stretch;
      }

      .topnav,
      .topbar-actions {
        justify-content: center;
      }
    }

    @media (max-width: 560px) {
      .hero h1 {
        max-width: none;
      }

      .hero-actions,
      .topbar-actions,
      .topnav {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-secondary,
      .btn-link {
        text-align: center;
      }

      .float-top,
      .float-bottom {
        position: static;
        margin-top: 12px;
        display: inline-flex;
      }
    }


    @media (max-width: 1080px) {
      .topbar {
        flex-wrap: wrap;
        justify-content: center;
      }

      .topnav {
        justify-content: center;
      }

      .topbar-actions {
        width: 100%;
        justify-content: center;
      }

      .hero {
        grid-template-columns: 1fr;
      }

      .hero h1 {
        max-width: none;
      }

      .hero-visual {
        min-height: auto;
      }

      .feature-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .ods-section {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .page-shell {
        padding: 16px 14px 34px;
      }

      .topbar {
        top: 10px;
        padding: 14px;
        border-radius: 18px;
      }

      .brand {
        width: 100%;
        justify-content: center;
      }

      .topnav {
        width: 100%;
        justify-content: center;
        gap: 12px;
      }

      .topbar-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .topbar-actions .btn-link,
      .topbar-actions .btn-primary {
        width: 100%;
        text-align: center;
      }

      .hero-metrics,
      .info-grid,
      .feature-grid {
        grid-template-columns: 1fr;
      }

      .visual-main,
      .info-panel,
      .feature-card,
      .ods-section,
      .cta-band {
        border-radius: 20px;
      }

      .float-top,
      .float-bottom {
        position: static;
        display: inline-flex;
        margin-top: 12px;
      }

      .hero-visual {
        display: block;
      }

      .cta-band-actions {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
      }
    }

    @media (max-width: 480px) {
      .hero h1 {
        font-size: 2rem;
      }

      .visual-main {
        padding: 20px;
      }

      .visual-main h2 {
        font-size: 1.55rem;
      }
    }
  `]
})
/**
 * Página pública de presentación de MoveUp.
 *
 * Esta vista resume el problema que atiende la aplicación, su relación con el ODS 3
 * y las funciones que el usuario encontrará después del inicio de sesión.
 */
export class PublicHomePage {}
