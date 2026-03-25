
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IPAQPage } from './ipaq.page';
import { IPAQPageRoutingModule } from './ipaq-routing.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IPAQPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [IPAQPage]
})
export class IPAQPageModule {}

