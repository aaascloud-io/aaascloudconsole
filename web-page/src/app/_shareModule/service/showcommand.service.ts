import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowcommandService {

  constructor() { }
  bodys: string[] = [];

  add(message:string) {
    this.bodys.push(message);
  }
 
  clear() {
    this.bodys = [];
  }
}
