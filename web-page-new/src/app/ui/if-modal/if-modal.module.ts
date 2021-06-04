import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfModalComponent} from "./if-modal.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfModalComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfModalComponent],
})
export class IfModalModule { }
