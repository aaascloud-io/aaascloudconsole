import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfDropzoneComponent} from "./if-dropzone.component";
import {FormsModule} from "@angular/forms";
import {NgxDropzoneModule} from "ngx-dropzone";


@NgModule({
    declarations: [IfDropzoneComponent],
    imports: [CommonModule, FormsModule, NgxDropzoneModule],
    exports: [IfDropzoneComponent],
})
export class IfDropzoneModule {
}
