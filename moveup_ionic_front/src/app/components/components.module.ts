
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ArticleComponent } from './article/article.component';
import { ArticlesComponent } from './articles/articles.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TipDelDiaComponent } from './tip-del-dia/tip-del-dia.component';

/**
 * Módulo compartido de componentes reutilizables.
 *
 * Aquí se agrupan los componentes visuales usados por distintas páginas
 * de la aplicación, para poder importarlos desde un solo lugar.
 */
@NgModule({
  declarations: [ArticleComponent, ArticlesComponent, TipDelDiaComponent],
  imports: [CommonModule, IonicModule, SidebarComponent],
  exports: [SidebarComponent, ArticleComponent, ArticlesComponent, TipDelDiaComponent],
})
export class ComponentsModule {}
