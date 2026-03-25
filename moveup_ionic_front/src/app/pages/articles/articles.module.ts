
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticlesPage } from './articles.page';
import { ArticlesPageRoutingModule } from './articles-routing.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ArticlesPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ArticlesPage]
})
export class ArticlesPageModule {}

