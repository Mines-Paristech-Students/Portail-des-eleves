import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from './models';

@Component({
    selector: '[marketplace-product]',
    templateUrl: './marketplace-product.component.html',
})
export class MarketplaceProductComponent extends Component {
    @Input() product: Product;
    @Input() basketQuantity: number;
    @Input() displayImage = false;
    @Input() displayDescription = false;
    @Output() addProduct = new EventEmitter();
    @Output() changeQuantity = new EventEmitter<number>();

    handleAddButtonClick(): void {
        this.addProduct.emit();
    }

    handleChangeQuantityButtonClick(newQuantity: string): void {
        this.changeQuantity.emit(Math.max(Number(newQuantity), 0));
    }
}
