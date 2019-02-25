import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: '[marketplace-counter-product]',
    templateUrl: './marketplace-counter-product.component.html',
})
export class MarketplaceCounterProductComponent extends Component {
    @Input() product;
    @Input() basketQuantity: number;
    @Output() addProduct = new EventEmitter();
    @Output() changeQuantity = new EventEmitter<number>();

    handleAddButtonClick() {
        this.addProduct.emit();
    }

    handleChangeQuantityButtonClick(newQuantity: number) {
        this.changeQuantity.emit(newQuantity);
    }
}