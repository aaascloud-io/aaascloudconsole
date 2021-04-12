import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TreeTable } from 'primeng/treetable';

@Component({
  selector: 'app-tree-table-toggler-customized',
  templateUrl: './tree-table-toggler-customized.component.html',
  styleUrls: ['./tree-table-toggler-customized.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TreeTableTogglerCustomizedComponent implements OnInit  {

  @Input() rowNode: any;

  constructor(public tt: TreeTable) { }

  ngOnInit(): void {}

  onClick(event: Event) {
    this.rowNode.node.expanded = !this.rowNode.node.expanded;

    if (this.rowNode.node.expanded) {
      this.tt.onNodeExpand.emit({
        originalEvent: event,
        node: this.rowNode.node
      });
    }
    else {
      this.tt.onNodeCollapse.emit({
        originalEvent: event,
        node: this.rowNode.node
      });
    }

    // 重新加載
    this.tt.updateSerializedValue();

    this.tt.tableService.onUIUpdate(this.tt.value);

    // 停止動作
    event.preventDefault();
  }

}
