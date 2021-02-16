import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductNamePipe } from './pipes/product-name.pipe';

@NgModule({
  declarations: [
    ProductNamePipe,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    ProductNamePipe,
  ]
})
export class ShareModuleModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: ShareModuleModule,
      providers: [ProductNamePipe]
    };
  }
}
