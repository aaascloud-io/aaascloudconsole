import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class EmitService {
    public eventEmit: any;

    constructor() {
        // 
        this.eventEmit = new EventEmitter();
    }
}