
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { BackendApiService, Categoria, HeaderCard, NivelActividad } from '../../services/backend-api.service';

@Component({
  selector: 'app-articles',
  templateUrl: 'articles.page.html',
  styleUrls: ['articles.page.scss'],
  standalone: false,
})
export class ArticlesPage implements OnInit {
  public nivelActividad: NivelActividad | null = null;
  public cards: HeaderCard[] = [];
  public filteredCards: HeaderCard[] = [];
  public categories: Categoria[] = ['Informate', 'salud', 'actividades', 'prevención', 'consecuencias'];
  public selectedCategory: Categoria | 'todas' = 'todas';

  constructor(
    private route: ActivatedRoute,
    private api: BackendApiService,
    private storageSvc: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.storageSvc.load();
    this.route.params.subscribe(params => {
      const nivel = params['nivel'];
      this.nivelActividad = (nivel === 'alto' || nivel === 'medio' || nivel === 'bajo') ? nivel : null;
      this.loadArticles();
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.storageSvc.load();
    this.filterByActivityLevel();
  }

  loadArticles(): void {
    this.api.getArticleCards(this.nivelActividad).subscribe({
      next: (data) => {
        this.cards = Array.isArray(data) ? data : [];
        this.filterByActivityLevel();
      },
      error: () => {
        this.cards = this.getBackupCards();
        this.filterByActivityLevel();
      }
    });
  }

  filterByActivityLevel(): void {
    let filtered = this.cards;
    if (this.nivelActividad) filtered = filtered.filter(card => card.nivelActividad === this.nivelActividad);
    if (this.selectedCategory !== 'todas') filtered = filtered.filter(c => c.categoria === this.selectedCategory);
    this.filteredCards = filtered;
  }

  segmentChanged(ev: CustomEvent): void {
    this.selectedCategory = (ev.detail as any).value as any;
    this.filterByActivityLevel();
  }

  getTitle(): string {
    if (!this.nivelActividad) return 'Artículos Recomendados';
    const titles = {
      alto: 'Artículos para Nivel Alto de Actividad',
      medio: 'Artículos para Nivel Moderado de Actividad',
      bajo: 'Artículos para Nivel Bajo de Actividad'
    };
    return titles[this.nivelActividad] || 'Artículos Recomendados';
  }

  getDescription(): string {
    if (!this.nivelActividad) return 'Explora artículos y recursos sobre sedentarismo y actividad física';
    const descriptions = {
      alto: 'Mantén tu excelente nivel de actividad física con estos recursos avanzados',
      medio: 'Mejora tu nivel de actividad física con estos recursos y recomendaciones',
      bajo: 'Comienza tu camino hacia una vida más activa con estos recursos básicos'
    };
    return descriptions[this.nivelActividad] || '';
  }

  getDescriptionTitle(): string {
    if (!this.nivelActividad) return 'Recursos para ti';
    const titles = { alto: '¡Excelente trabajo!', medio: '¡Sigue mejorando!', bajo: '¡Comienza hoy!' };
    return titles[this.nivelActividad] || '';
  }

  getDescriptionIcon(): string {
    if (!this.nivelActividad) return 'star-outline';
    const icons = { alto: 'trophy', medio: 'trending-up', bajo: 'rocket' };
    return icons[this.nivelActividad] || 'star-outline';
  }

  trackByTitulo(_: number, card: HeaderCard): string {
    return card.titulo;
  }

  private createArticleFromCard(card: HeaderCard) {
    return {
      source: { name: card.categoria },
      title: card.titulo,
      description: card.descripcion,
      url: card.url,
      urlToImage: card.imagen,
      publishedAt: new Date(),
      content: undefined,
      author: undefined
    };
  }

  isCardFav(card: HeaderCard): boolean {
    return this.storageSvc.articleInFavorites(this.createArticleFromCard(card));
  }

  async toggleFavFromCard(ev: Event, card: HeaderCard): Promise<void> {
    ev.preventDefault();
    ev.stopPropagation();
    const art = this.createArticleFromCard(card);
    if (this.storageSvc.articleInFavorites(art)) await this.storageSvc.removeArticle(art);
    else await this.storageSvc.saveArticle(art);
  }

  private getBackupCards(): HeaderCard[] {
    return [
      { titulo: '¿Qué es el sedentarismo?', descripcion: 'Definición y panorama.', url: 'https://example.com/sedentarismo', imagen: 'assets/images/imagen1.png', categoria: 'Informate', nivelActividad: 'bajo' },
      { titulo: 'Pausas activas 3×10', descripcion: 'Guía breve para oficina.', url: 'https://example.com/pausas', imagen: 'assets/images/imagen1.png', categoria: 'actividades', nivelActividad: 'bajo' },
      { titulo: 'Riesgo cardiovascular', descripcion: 'Resumen de evidencia.', url: 'https://example.com/corazon', imagen: 'assets/images/imagen1.png', categoria: 'salud', nivelActividad: 'medio' },
    ];
  }
}
