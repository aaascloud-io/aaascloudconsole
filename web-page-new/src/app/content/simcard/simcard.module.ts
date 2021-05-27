import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SimcardComponent} from './simcard.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {SimcardRoutingModule} from './simcard-routing.module';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbModule} from 'src/app/_layout/breadcrumb/breadcrumb.module';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {UiSwitchModule} from 'ngx-ui-switch';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TreeTableModule} from 'primeng/treetable';
import {IfTableModule} from "../../ui/if-table/if-table.module";

@NgModule({
    imports: [
        CommonModule,
        SimcardRoutingModule,
        NgxDatatableModule,
        BreadcrumbModule,
        FormsModule,
        NgbModule,
        PerfectScrollbarModule,
        NgSelectModule,
        UiSwitchModule,
        ToastModule,
        ButtonModule,
        RippleModule,
        ConfirmDialogModule,
        RouterModule.forChild([
            {
                path: '',
                component: SimcardComponent
            },
        ]),
        TreeTableModule,
        IfTableModule,
    ],
    declarations: [SimcardComponent],
    exports: [RouterModule]

})
export class SimcardModule {
}
