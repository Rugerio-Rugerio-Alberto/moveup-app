
import { Component, Input } from '@angular/core';
import { Article } from '../../interfaces';

/**
 * Tarjeta individual para mostrar un artículo.
 *
 * Recibe los datos del artículo y su posición dentro de la lista.
 */
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: false,
})
export class ArticleComponent {
  /** Artículo recibido desde el componente padre. */
  @Input() article!: Article;

  /** Índice visible del artículo dentro de la lista. */
  @Input() index!: number;

  /**
   * Nombre de la fuente del artículo.
   * Se usa una validación defensiva para evitar errores en plantilla.
   */
  get sourceName(): string {
    return this.article?.source?.name || 'Fuente no disponible';
  }
}
