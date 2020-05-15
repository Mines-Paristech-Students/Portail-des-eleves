import React, { useState } from "react";
import { Button } from "react-bootstrap";

export const QuantitySelect = ({ order }) => {
    let [quantity, setQuantity] = useState(0);

    let increase = () => {
        setQuantity(quantity + 1);
    };
    let decrease = () => {
        setQuantity(quantity - 1);
    };

    let onOrder = () => {
        order(quantity);
        setQuantity(0);
    };

    if (quantity === 0) {
        return (
            <Button variant="primary" onClick={increase}>
                <i className="fe fe-plus" />
                Commander
            </Button>
        );
    }

    return (
        <>
            <div className="input-group">
                <span className="input-group-prepend">
                    <Button variant="secondary" onClick={decrease}>
                        <i className="fe fe-minus" />
                    </Button>
                </span>
                <input
                    type="number"
                    value={quantity}
                    className="form-control"
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <span className="input-group-append mr-3">
                    <Button variant="secondary" onClick={increase}>
                        <i className="fe fe-plus" />
                    </Button>
                </span>

                <Button variant="success" onClick={onOrder}>
                    <span
                        className="fe fe-shopping-cart"
                        aria-label={"Passer la commande"}
                        title={"Passer la commande"}
                    />
                </Button>
            </div>
        </>
    );
};
