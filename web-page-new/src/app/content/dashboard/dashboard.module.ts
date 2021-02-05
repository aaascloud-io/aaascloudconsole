import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { ChartistModule } from 'ng-chartist';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardModule } from '../partials/general/card/card.module';
import { ChartsModule } from 'ng2-charts';
import { SalesComponent } from './sales/sales.component';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from '../../_layout/blockui/block-template.component';
import { MatchHeightModule } from '../partials/general/match-height/match-height.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    ChartistModule,
    FormsModule,
    ChartsModule,
    CardModule,
    MatchHeightModule,
    NgxDatatableModule,
    PerfectScrollbarModule,
    NgbModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: 'ecommerce',
        component: EcommerceComponent
      },
      {
        path: 'sales',
        component: SalesComponent
      },
    ])
  ],
  declarations: [EcommerceComponent, SalesComponent],

  exports: [RouterModule]
})
export class DashboardModule { }
