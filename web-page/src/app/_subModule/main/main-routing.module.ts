import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'option', loadChildren: './option/option.module#OptionModule' },
      { path: 'page', loadChildren: './page/page.module#PageModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
