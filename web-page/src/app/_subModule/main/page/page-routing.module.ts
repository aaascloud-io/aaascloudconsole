import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VersionComponent } from './version/version.component';
import { PageComponent } from './page.component';

const routes: Routes = [
  {
    path: '', component: PageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'version', component: VersionComponent },
      { path: 'product', loadChildren: './product/product.module#ProductModule' },
      { path: 'device', loadChildren: './device/device.module#DeviceModule' },
      { path: 'userManager', loadChildren: './user-manager/user-manager.module#UserManagerModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
