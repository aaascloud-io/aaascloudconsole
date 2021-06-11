import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsDropzoneComponent} from "./ifcs-dropzone.component";
import {FormsModule} from "@angular/forms";
import {NgxDropzoneModule} from "ngx-dropzone";


@NgModule({
    declarations: [IfcsDropzoneComponent],
    imports: [CommonModule, FormsModule, NgxDropzoneModule],
    exports: [IfcsDropzoneComponent],
})
export class IfcsDropzoneModule {
}
