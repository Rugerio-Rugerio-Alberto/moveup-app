
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Article } from '../../interfaces';
import { BackendApiService, Categoria, HeaderCard } from '../../services/backend-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  public categories: Categoria[] = ['Informate', 'salud', 'actividades', 'prevención', 'consecuencias'];
  public selectedCategory: Categoria | 'todas' = 'Informate';
  public cards: HeaderCard[] = [];

  constructor(private api: BackendApiService, private favs: StorageService) {}

  async ngOnInit(): Promise<void> {
    await this.storageReady();
    this.loadCards();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.storageReady();
    this.loadCards();
  }

  private async storageReady(): Promise<void> {
    await this.favs.load();
  }

  private loadCards(): void {
    this.api.getArticleCards().subscribe({
      next: data => { this.cards = Array.isArray(data) ? data : []; },
      error: () => {}
    });
  }

  get filteredCards(): HeaderCard[] {
    if (this.selectedCategory === 'todas') return this.cards;
    return this.cards.filter(c => c.categoria === this.selectedCategory);
  }

  segmentChanged(ev: CustomEvent) {
    this.selectedCategory = (ev.detail as any).value as any;
  }

  trackByTitulo(_: number, card: HeaderCard): string {
    return card.titulo;
  }

  private createArticleFromCard(card: HeaderCard): Article {
    return {
      source: { name: card.categoria },
      title: card.titulo,
      description: card.descripcion,
      url: card.url,
      urlToImage: card.imagen,
      publishedAt: new Date(),
      content: undefined,
      author: undefined
    } as Article;
  }

  isCardFav(card: HeaderCard): boolean {
    return this.favs.articleInFavorites(this.createArticleFromCard(card));
  }

  async toggleFavFromCard(ev: Event, card: HeaderCard) {
    ev.preventDefault();
    ev.stopPropagation();
    const art = this.createArticleFromCard(card);
    if (this.favs.articleInFavorites(art)) await this.favs.removeArticle(art);
    else await this.favs.saveArticle(art);
  }
}
