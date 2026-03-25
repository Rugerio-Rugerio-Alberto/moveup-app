

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';
import { BackendApiService } from './backend-api.service';

const KEY = 'favorites:v2';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage, private backend: BackendApiService) {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
    const stored = await this._storage.get(KEY);
    this._localArticles = Array.isArray(stored) ? stored : [];
  }

  get articles(): Article[] {
    return this._localArticles;
  }

  private async persistLocal() {
    await this._storage?.set(KEY, this._localArticles);
  }

  async load(): Promise<Article[]> {
    if (!this._storage) await this.init();

    try {
      const remote = await this.backend.getFavoritesAsync();
      this._localArticles = Array.isArray(remote) ? remote : [];
      await this.persistLocal();
      return this._localArticles;
    } catch {
      const stored = await this._storage!.get(KEY);
      this._localArticles = Array.isArray(stored) ? stored : [];
      return this._localArticles;
    }
  }

  async saveArticle(article: Article) {
    if (this.articleInFavorites(article)) return;

    try {
      await this.backend.addFavoriteAsync(article);
      await this.load();
      return;
    } catch {}

    this._localArticles = [article, ...this._localArticles];
    await this.persistLocal();
  }

  async removeArticle(article: Article) {
    try {
      const current = await this.load();
      const found = current.find((a: any) => (a as any).id && a.title === article.title && a.url === article.url);
      if (found && (found as any).id) {
        await this.backend.deleteFavoriteAsync((found as any).id);
        await this.load();
        return;
      }
    } catch {}

    this._localArticles = this._localArticles.filter(a => a.title !== article.title || a.url !== article.url);
    await this.persistLocal();
  }

  articleInFavorites(article: Article): boolean {
    return !!this._localArticles.find(a => a.title === article.title && a.url === article.url);
  }

  async clear() {
    for (const article of [...this._localArticles]) {
      await this.removeArticle(article);
    }
    this._localArticles = [];
    await this.persistLocal();
  }

  async clearLocalCache() {
    this._localArticles = [];
    await this._storage?.remove(KEY);
  }
}
