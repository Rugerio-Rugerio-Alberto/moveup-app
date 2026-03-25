
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-accessibility-modal',
  templateUrl: './accessibility-modal.component.html',
  styleUrls: ['./accessibility-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class AccessibilityModalComponent {
  @Input() platform: 'android' | 'ios' | 'web' = 'web';

  constructor(private modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss();
  }

  getInstructions() {
    switch (this.platform) {
      case 'android':
        return {
          title: 'Activar TalkBack',
          quickAction: 'Método rápido: Mantén presionados los botones de Volumen + y - durante 3 segundos',
          steps: [
            'Abre "Configuración" en tu Android',
            'Toca "Accesibilidad"',
            'Activa "TalkBack"',
            'O di "OK Google, activar TalkBack"',
            'Navega deslizando con dos dedos, toca dos veces para seleccionar'
          ],
          shortcut: 'Atajo: Volumen + y - juntos (3 segundos)'
        };
      case 'ios':
        return {
          title: 'Activar VoiceOver',
          quickAction: 'Método rápido: Di "Oye Siri, activa VoiceOver" o presiona el botón lateral 3 veces',
          steps: [
            'Abre "Configuración" en tu iPhone/iPad',
            'Toca "Accesibilidad"',
            'Activa "VoiceOver"',
            'O di "Oye Siri, activa VoiceOver"',
            'Navega deslizando con un dedo, toca dos veces para seleccionar'
          ],
          shortcut: 'Atajo: Botón lateral 3 veces (si está configurado)'
        };
      default:
        return {
          title: 'Lector de Pantalla',
          quickAction: 'En móvil: Usa la versión Android o iOS de la app',
          steps: [
            'Esta app está optimizada para móviles',
            'Instala la app en tu Android o iPhone',
            'Sigue las instrucciones según tu dispositivo',
            'La app detectará automáticamente tu plataforma'
          ],
          shortcut: null
        };
    }
  }
}

