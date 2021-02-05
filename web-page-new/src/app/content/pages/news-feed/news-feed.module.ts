import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { MatchHeightModule } from '../../partials/general/match-height/match-height.module';

@NgModule({
  declarations: [NewsFeedComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    MatchHeightModule,
    RouterModule.forChild([
      {
        path: 'news-feed',
        component: NewsFeedComponent
      },
    ]),
  ]
})
export class NewsFeedModule { }
