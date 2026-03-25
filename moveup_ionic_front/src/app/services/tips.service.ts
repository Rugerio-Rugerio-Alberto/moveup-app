

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TipsService {
  private tips: string[] = [
    'Levántate 5 minutos por cada hora sentado.',
    'Sube escaleras cuando puedas. Activa glúteos y cardio.',
    'Bebe agua cada 60–90 minutos. Menos bebidas azucaradas.',
    'Mira a 20 pies por 20 segundos cada 20 minutos (regla 20-20-20).',
    'Camina mientras escuchas clases grabadas o podcasts.',
    'Estira cuello y hombros: 3 series de 20 segundos.',
    'Duerme 7–9 horas. La recuperación también previene sedentarismo.',
    'Planifica 3 micro-pausas de movimiento en tu jornada.',
    'Evita comer frente a la pantalla. Camina breve después.',
    'Coloca recordatorios visibles: “muévete ahora”.'
  ];

  getTipFor(date: Date = new Date()): string {
    const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    const idx = hash % this.tips.length;
    return this.tips[idx];
  }
}
