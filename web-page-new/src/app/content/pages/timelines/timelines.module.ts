import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelinesLeftComponent } from './timelines-left/timelines-left.component';
import { TimelinesRightComponent } from './timelines-right/timelines-right.component';
import { TimelinesHorizontalComponent } from './timelines-horizontal/timelines-horizontal.component';
import { TimelinesCenterComponent } from './timelines-center/timelines-center.component';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { CardModule } from '../../partials/general/card/card.module';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { NgxEchartsModule } from 'ngx-echarts';
import {Angular2PhotoswipeModule} from 'angular2_photoswipe';
import { HorizontalTimelinePageComponent } from './timelines-horizontal/horizontal-timeline-page/horizontal-timeline-page.component';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    CardModule,
    ChartsModule,
    FormsModule,
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
        path: 'timelines-center',
        component: TimelinesCenterComponent
      },
      {
        path: 'timelines-left',
        component: TimelinesLeftComponent
      },
      {
        path: 'timelines-right',
        component: TimelinesRightComponent
      },
      {
        path: 'timelines-horizontal',
        component: TimelinesHorizontalComponent
      }
    ]),
  ],
  declarations: [TimelinesLeftComponent, TimelinesRightComponent, TimelinesHorizontalComponent, TimelinesCenterComponent,
    HorizontalTimelinePageComponent]
})
export class TimelinesModule { }
