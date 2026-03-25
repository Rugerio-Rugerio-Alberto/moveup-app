
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TipsService } from '../../services/tips.service';

/**
 * Muestra un consejo breve en la pantalla principal.
 *
 * El consejo se calcula desde un servicio para mantener aislada la lógica
 * de selección y dejar este componente solo como presentacional.
 */
@Component({
  selector: 'app-tip-del-dia',
  templateUrl: './tip-del-dia.component.html',
  styleUrls: ['./tip-del-dia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TipDelDiaComponent implements OnInit {
  /** Texto del consejo del día. */
  tip = '';

  /** Fecha actual mostrada en la tarjeta. */
  fechaActual = new Date();

  constructor(private tips: TipsService) {}

  ngOnInit(): void {
    this.tip = this.tips.getTipFor();
  }
}
