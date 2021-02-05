import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchWebsiteComponent } from './search-website/search-website.component';
import { SearchImagesComponent } from './search-images/search-images.component';
import { SearchVideosComponent } from './search-videos/search-videos.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { Angular2PhotoswipeModule } from 'angular2_photoswipe';

@NgModule({
  imports: [
    CommonModule,
    Angular2PhotoswipeModule,
    NgbModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: 'searchWebsite',
        component: SearchWebsiteComponent
      },
      {
        path: 'searchImages',
        component: SearchImagesComponent
      },
      {
        path: 'searchVideos',
        component: SearchVideosComponent
      }
    ]),
  ],
  declarations: [SearchWebsiteComponent, SearchImagesComponent, SearchVideosComponent],
  exports: [RouterModule]
})
export class SearchModule { }
