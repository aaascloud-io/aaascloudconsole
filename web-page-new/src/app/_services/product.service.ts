import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  // TODO
  getProductNameById(id: number): string{
    return "test"
  }
}
