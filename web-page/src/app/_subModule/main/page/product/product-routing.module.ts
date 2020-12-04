import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ModifyComponent } from './modify/modify.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: '', redirectTo: 'list' },
  { path: 'create', component: CreateComponent },
  { path: 'detail', component: DetailComponent },
  { path: 'modify', component: ModifyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
