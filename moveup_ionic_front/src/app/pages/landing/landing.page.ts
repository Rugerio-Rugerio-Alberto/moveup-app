
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { AccessibilityModalComponent } from '../../components/accessibility-modal/accessibility-modal.component';

/**
 * Pantalla principal protegida de la aplicación.
 *
 * Aquí se presenta el contenido central sobre sedentarismo para usuarios autenticados,
 * con acceso directo al cuestionario IPAQ y a funciones de accesibilidad.
 */
@Component({
  selector: 'app-landing',
  templateUrl: 'landing.page.html',
  styleUrls: ['landing.page.scss'],
  standalone: false,
})
export class LandingPage {
  /**
   * Inyecta dependencias para navegación, modales y detección de plataforma.
   */
  constructor(
    private router: Router,
    private modalController: ModalController,
    private platform: Platform
  ) {}

  /**
   * Mantiene la navegación en la pantalla principal autenticada.
   * Se conserva para acciones de la interfaz que apuntan al inicio interno.
   */
  goToApp() {
    this.router.navigate(['/home']);
  }

  /** Redirige al cuestionario IPAQ. */
  goToIPAQ() {
    this.router.navigate(['/ipaq']);
  }

  /** Abre el modal de accesibilidad según la plataforma actual. */
  async openAccessibilityModal() {
    const modal = await this.modalController.create({
      component: AccessibilityModalComponent,
      componentProps: {
        platform: this.platform.is('android') ? 'android' : this.platform.is('ios') ? 'ios' : 'web'
      },
      cssClass: 'accessibility-modal'
    });
    return await modal.present();
  }
}

