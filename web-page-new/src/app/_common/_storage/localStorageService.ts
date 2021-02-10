

export class LocalStorageService {
    static getItem(item:any):any{
        return JSON.parse(localStorage.getItem(item.id));
    }
    static clear(id:string):void{
        localStorage.removeItem(id);
    }
    static add(item:any):void{
        let sitem = this.getItem(item) || new Array<string>();
        let temp = sitem.concat(item.value);
        localStorage.setItem(item.id,JSON.stringify(temp));
    }
    static delete(item:any):void{
       let item_value_final = this.getItem(item);
       let temp = item_value_final.filter((_item) => {
        return _item !== item.value;
       });
       localStorage.setItem(item.id, JSON.stringify(temp));
    }
    static getIndexOf(item:any):boolean{
        let flg:boolean = false;
        let sitem = this.getItem(item) || new Array<string>();
        if(sitem.length>0){
            if(sitem.indexOf(item.value)>-1){
                flg = true;
            }
        }
        return flg;
    }

    static setItem(item:any) :void {
        localStorage.setItem(item.id,JSON.stringify(item.value));
    }

    static delItem(item:any) : void {
        localStorage.removeItem(item.id);
    }
}