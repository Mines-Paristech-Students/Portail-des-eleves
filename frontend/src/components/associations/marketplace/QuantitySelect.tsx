import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./QuantitySelect.css";
import { queryCache } from "react-query";

export const QuantitySelect = ({ order }) => {
    const [quantity, setQuantity] = useState(0);

    const increase = () => {
        setQuantity(quantity + 1);
    };
    const decrease = () => {
        setQuantity(quantity - 1);
    };

    const onOrder = () => {
        order(quantity);
        setQuantity(0);
        queryCache.refetchQueries(["marketplace.balance"]);
    };

    return quantity === 0 ? (
        <Button variant="outline-primary" onClick={increase}>
            <i className="fe fe-plus" />
            Commander
        </Button>
    ) : (
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
