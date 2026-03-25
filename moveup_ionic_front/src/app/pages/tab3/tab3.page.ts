
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Article } from '../../interfaces';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  articles: Article[] = [];

  constructor(private storageSvc: StorageService) {}

  async ngOnInit() {
    this.articles = await this.storageSvc.load();
  }

  async ionViewWillEnter() {
    this.articles = await this.storageSvc.load();
  }

  async remove(article: Article, ev?: Event) {
    ev?.preventDefault();
    ev?.stopPropagation();
    await this.storageSvc.removeArticle(article);
    this.articles = await this.storageSvc.load();
  }

  trackByTitle(_: number, a: Article) { return a.title; }
}
