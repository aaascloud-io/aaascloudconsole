import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesComponent } from './services/services.component';
import { OverlaysComponent } from './overlays/overlays.component';
import { GeocodingService } from 'src/app/_services/geocoding.service';
import { RoutesComponent } from './routes/routes.component';
import { AgmDirectionModule } from 'agm-direction';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { CardModule } from '../partials/general/card/card.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    CardModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    AgmDirectionModule,
    RouterModule.forChild([
      {
        path: 'maps',
        component: MapsComponent
      },
      {
        path: 'services',
        component: ServicesComponent
      },
      {
        path: 'overlays',
        component: OverlaysComponent
      },
      {
        path: 'routes',
        component: RoutesComponent
      },
    ])
  ],
  providers: [
    GeocodingService,
    GoogleMapsAPIWrapper
  ],
  declarations: [MapsComponent, ServicesComponent, OverlaysComponent, RoutesComponent],
})
export class MapsModule { }
