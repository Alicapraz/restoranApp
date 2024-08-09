import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { CardDetailPageComponent } from '../card-detail-page/card-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  // {
  //   path: 'detail',
  //   component: CardDetailPageComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
