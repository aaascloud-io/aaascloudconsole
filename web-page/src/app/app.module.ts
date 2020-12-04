
import { ShareModule } from './_shareModule/share.module';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
// Import your library
import { AlertModule } from 'ngx-alerts';
import { BlockUIModule } from 'ng-block-ui';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ShareModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, position: 'right' }),
    BlockUIModule.forRoot(),
  ],
  exports: [ShareModule],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
