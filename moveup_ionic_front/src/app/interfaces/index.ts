/**
 * Respuesta estándar del servicio de noticias.
 */
export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

/**
 * Modelo de artículo usado en frontend y favoritos.
 */
export interface Article {
  source: Source;
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: Date;
  content?: string;
}

/**
 * Información básica de la fuente que publica el artículo.
 */
export interface Source {
  id?: string;
  name: string;
}
