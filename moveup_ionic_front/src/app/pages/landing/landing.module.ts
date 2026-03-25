
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingPage } from './landing.page';
import { LandingPageRoutingModule } from './landing-routing.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LandingPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [LandingPage]
})
export class LandingPageModule {}

