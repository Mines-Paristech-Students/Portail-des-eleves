import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from './models';

@Component({
    selector: '[marketplace-counter-product]',
    templateUrl: './marketplace-counter-product.component.html',
})
export class MarketplaceCounterProductComponent extends Component {
    @Input() product: Product;
    @Input() basketQuantity: number;
    @Output() addProduct = new EventEmitter();
    @Output() changeQuantity = new EventEmitter<number>();

    handleAddButtonClick(): void {
        this.addProduct.emit();
    }

    handleChangeQuantityButtonClick(newQuantity: string): void {
        this.changeQuantity.emit(Math.max(Number(newQuantity), 0));
    }
}
