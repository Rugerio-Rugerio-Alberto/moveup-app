
import { Component, Input } from '@angular/core';
import { Article } from '../../interfaces';

/**
 * Contenedor de tarjetas de artículos.
 *
 * Su única responsabilidad es recibir una colección y renderizarla
 * en forma de cuadrícula responsive.
 */
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: false,
})
export class ArticlesComponent {
  /** Lista de artículos a mostrar en pantalla. */
  @Input() articles: Article[] = [];
}
