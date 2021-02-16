import { Pipe, PipeTransform } from '@angular/core';
import { ProductService } from 'src/app/_services/product.service';

@Pipe({
  name: 'productName'
})
export class ProductNamePipe implements PipeTransform {

  constructor(){}

  transform(value: number): string {
    // return this.productService.getProductNameById(value);
    return "ok"
  }

}
