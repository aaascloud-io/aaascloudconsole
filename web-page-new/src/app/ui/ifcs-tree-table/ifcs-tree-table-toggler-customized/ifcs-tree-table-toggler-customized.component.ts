import {Component, Input, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {TreeTable} from "primeng/treetable";


@Component({
    selector: 'ifcs-tree-table-toggler-customized',
    templateUrl: './ifcs-tree-table-toggler-customized.component.html',
    styleUrls: ['./ifcs-tree-table-toggler-customized.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class IfcsTreeTableTogglerCustomizedComponent implements OnInit {

    @Input() rowNode: any;
    @Input() parentOutTemplate: TemplateRef<HTMLElement>;


    constructor(public tt: TreeTable) {
    }

    ngOnInit(): void {
    }

    onClick(event) {
        this.rowNode.node.expanded = !this.rowNode.node.expanded;

        if (this.rowNode.node.expanded) {
            this.tt.onNodeExpand.emit({
                originalEvent: event,
                node: this.rowNode.node
            });
        } else {
            this.tt.onNodeCollapse.emit({
                originalEvent: event,
                node: this.rowNode.node
            });
        }

        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt.value);

        event.preventDefault();
    }

}
