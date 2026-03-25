
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IPAQPage } from './ipaq.page';

const routes: Routes = [
  {
    path: '',
    component: IPAQPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IPAQPageRoutingModule {}

