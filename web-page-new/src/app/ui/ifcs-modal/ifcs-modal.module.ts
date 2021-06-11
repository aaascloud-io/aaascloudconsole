import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsModalComponent} from "./ifcs-modal.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfcsModalComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfcsModalComponent],
})
export class IfcsModalModule { }
