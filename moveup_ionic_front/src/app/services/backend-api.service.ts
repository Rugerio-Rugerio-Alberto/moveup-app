

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article } from '../interfaces';

/** Nivel de actividad usado para filtrar artículos recomendados. */
export type NivelActividad = 'alto' | 'medio' | 'bajo';

/** Categorías temáticas disponibles para los artículos. */
export type Categoria = 'Informate' | 'actividades' | 'salud' | 'consecuencias' | 'prevención';

/** Estructura de tarjeta resumida enviada por el backend. */
export interface HeaderCard {
  titulo: string;
  descripcion?: string;
  url: string;
  imagen?: string;
  categoria: Categoria;
  nivelActividad?: NivelActividad;
}

/** Resultado del formulario IPAQ antes de enviarse al backend. */
export interface IPAQResultPayload {
  totalMETMinutes: number;
  vigorousMETMinutes: number;
  moderateMETMinutes: number;
  walkingMETMinutes: number;
  sittingMinutes: number;
  category: 'Bajo' | 'Moderado' | 'Alto' | 'bajo' | 'moderado' | 'alto';
  answers?: unknown;
}

/** Registro del avance de la rutina semanal. */
export interface RoutineProgressItem {
  date: string;
  habitsCompleted: string[];
  isComplete: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Servicio centralizado para comunicarse con el backend Django.
 *
 * Agrupa endpoints de artículos, favoritos, IPAQ y progreso de rutina.
 */
@Injectable({ providedIn: 'root' })
export class BackendApiService {
  /** URL base de la API REST. */
  private readonly api = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) {}

  /** Obtiene las tarjetas de artículos con filtros opcionales. */
  getArticleCards(nivel?: NivelActividad | null, categoria?: string): Observable<HeaderCard[]> {
    let params = new HttpParams();
    if (nivel) params = params.set('nivel', nivel);
    if (categoria && categoria !== 'todas') params = params.set('categoria', categoria);
    return this.http.get<HeaderCard[]>(`${this.api}/articles/cards/`, { params });
  }

  /** Recupera la lista de favoritos del usuario autenticado. */
  getFavorites(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.api}/favorites/`);
  }

  /** Agrega un artículo a favoritos. */
  addFavorite(article: Article): Observable<Article> {
    return this.http.post<Article>(`${this.api}/favorites/`, article);
  }

  /** Elimina un artículo de favoritos por identificador. */
  deleteFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/favorites/${id}/`);
  }

  /** Envía los resultados del cuestionario IPAQ. */
  submitIPAQ(result: IPAQResultPayload): Observable<unknown> {
    const payload = {
      ...result,
      category: String(result.category).toLowerCase(),
    };
    return this.http.post(`${this.api}/ipaq/submit/`, payload);
  }

  /** Obtiene el último resultado IPAQ guardado para el usuario. */
  getLatestIPAQ(): Observable<unknown> {
    return this.http.get(`${this.api}/ipaq/latest/`);
  }

  /** Recupera el progreso de la rutina semanal. */
  getRoutineProgress(): Observable<RoutineProgressItem[]> {
    return this.http.get<RoutineProgressItem[]>(`${this.api}/routine/progress/`);
  }

  /** Guarda el progreso de la rutina semanal. */
  saveRoutineProgress(items: RoutineProgressItem[]): Observable<RoutineProgressItem[]> {
    return this.http.post<RoutineProgressItem[]>(`${this.api}/routine/progress/`, { items });
  }

  // Helpers asincrónicos basados en Promise para componentes que prefieren async/await.
  getArticleCardsAsync(nivel?: NivelActividad | null, categoria?: string): Promise<HeaderCard[]> {
    return firstValueFrom(this.getArticleCards(nivel, categoria));
  }

  getFavoritesAsync(): Promise<Article[]> {
    return firstValueFrom(this.getFavorites());
  }

  addFavoriteAsync(article: Article): Promise<Article> {
    return firstValueFrom(this.addFavorite(article));
  }

  deleteFavoriteAsync(id: number): Promise<void> {
    return firstValueFrom(this.deleteFavorite(id));
  }

  submitIPAQAsync(result: IPAQResultPayload): Promise<unknown> {
    return firstValueFrom(this.submitIPAQ(result));
  }

  getLatestIPAQAsync(): Promise<unknown> {
    return firstValueFrom(this.getLatestIPAQ());
  }

  getRoutineProgressAsync(): Promise<RoutineProgressItem[]> {
    return firstValueFrom(this.getRoutineProgress());
  }

  saveRoutineProgressAsync(items: RoutineProgressItem[]): Promise<RoutineProgressItem[]> {
    return firstValueFrom(this.saveRoutineProgress(items));
  }
}
