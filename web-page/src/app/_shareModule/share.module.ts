import { NgModule,ModuleWithProviders} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
//service
import { AuthSignService } from './service/AuthSignService';
import { AuthSignListener } from './service/AuthSignListener';
import { AuthSignListenerChild } from './service/AuthSignListenerChild';
import { DataFatoryService } from './service/DataFatoryService';
import { EmitService } from './service/EmitService';
import { HttpService } from './service/HttpService';
import { BaseService } from './service/BaseService';
import { SubjectService } from './service/SubjectService';
import { MenuListener } from './service/MenuListener';
//pipe

//component

@NgModule({
  imports: [
    HttpClientModule,

  ],
  exports:[
    HttpClientModule,
  ],
  declarations: []
})
export class ShareModule { 
  static forRoot():ModuleWithProviders{
    return {
      ngModule:ShareModule,
      providers:[AuthSignService,AuthSignListener,AuthSignListenerChild,DataFatoryService,
        EmitService,HttpService,BaseService,SubjectService,MenuListener]
    }
  }
}
