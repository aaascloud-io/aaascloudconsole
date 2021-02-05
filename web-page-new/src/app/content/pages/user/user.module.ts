import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardsComponent } from './user-cards/user-cards.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { BlockUIModule } from 'ng-block-ui';
import { CardModule } from '../../partials/general/card/card.module';
import { environment } from 'src/environments/environment';
import {Angular2PhotoswipeModule} from 'angular2_photoswipe';
@NgModule({
  declarations: [UserCardsComponent, UserProfileComponent],
  imports: [
    CommonModule,
    CardModule,
    NgxEchartsModule,
    ChartsModule,
    NgbModule,
    BreadcrumbModule,
    Angular2PhotoswipeModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    RouterModule.forChild([
      {
        path: 'user-profile',
        component: UserProfileComponent
      },
      {
        path: 'user-cards',
        component: UserCardsComponent
      },
    ]),
  ]
})
export class UserModule { }
