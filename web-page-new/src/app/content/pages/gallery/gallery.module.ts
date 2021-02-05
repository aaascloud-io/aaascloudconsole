import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryGridComponent } from './gallery-grid/gallery-grid.component';
import { GalleryGridDescComponent } from './gallery-grid-desc/gallery-grid-desc.component';
import { MasonryGalleryComponent } from './masonry-gallery/masonry-gallery.component';
import { HoverEffectComponent } from './hover-effect/hover-effect.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { MasonryGalleryModule } from 'ngx-masonry-gallery';
import { CardModule } from '../../partials/general/card/card.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import {Angular2PhotoswipeModule} from 'angular2_photoswipe';
@NgModule({
  imports: [
    CommonModule,
    CardModule,
    BreadcrumbModule,
    Angular2PhotoswipeModule,
    MasonryGalleryModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
         path: 'gallery-grid',
         component: GalleryGridComponent
       },
       {
         path: 'gallery-grid-desc',
         component: GalleryGridDescComponent
       },
       {
         path: 'masonry-gallery',
         component: MasonryGalleryComponent
       },
       {
         path: 'hover-effect',
         component: HoverEffectComponent
       },
     ]),
  ],
  declarations: [GalleryGridComponent, GalleryGridDescComponent, MasonryGalleryComponent,
    HoverEffectComponent]
})
export class GalleryModule { }
