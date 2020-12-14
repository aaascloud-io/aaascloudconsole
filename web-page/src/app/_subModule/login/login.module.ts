// i18n国際化
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ShareModule } from '../../_shareModule/share.module';
import { FormsModule } from '@angular/forms';

// i18n国際化
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }
@NgModule({
  imports: [
    LoginRoutingModule,
    // ShareModule.forRoot(),
    FormsModule,
    // i18n国際化
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
