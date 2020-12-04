import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuListener } from './_shareModule/service/MenuListener';
const routes: Routes = [
  { path: 'login', loadChildren: './_subModule/login/login.module#LoginModule' },
  { path: 'main', loadChildren: './_subModule/main/main.module#MainModule', canActivateChild: [MenuListener], canActivate: [] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }