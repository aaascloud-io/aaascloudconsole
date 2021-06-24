import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {IfcsTreeTableModule} from "./ifcs-tree-table.module";
import {TreeNode} from "primeng/api";


@Injectable()
export class IfcsTreeTableService {

    // ページデータ
    private currentData = new Subject<any>();
    public currentDataCalled$ = this.currentData.asObservable();


    public doCreateTreeNode(data: any[], dest: TreeNode[], parentKey: string, key: string): void {
        this.sort(data, parentKey);
        for (let idx = 0; idx < data.length; idx++) {
            let item = data[idx];
            let parentId = item[parentKey];
            if (!parentId) {
                item.isParent = true;
                dest.push({"data": item, "children": []});
                continue;
            }
            let parent = this.findTreeNode(dest, parentId, key);
            if (parent) {
                parent.data.isParent = true;
                parent.children.push({"data": item, "children": []});
            } else {
                item.isParent = true;
                dest.push({"data": item, "children": []});
            }
        }
    }

    private sort(list: any[], key: string): void {
        list.sort((a, b) => {
            let x = a[key];
            let y = b[key];
            return x < y ? -1 : 1;
        });
    }

    private findTreeNode(dest: TreeNode[], search: any, key: string): TreeNode {
        let result = null;
        for (let idx = 0; idx < dest.length; idx++) {
            let item = dest[idx];
            if (item.data[key] === search) {
                return item;
            }
            if (item.children.length > 0) {
                result = this.findTreeNode(item.children, search, key);
            }
            if (result) {
                return result;
            }
        }
    }


}
