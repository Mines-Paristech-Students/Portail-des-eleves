import React from "react";

export const OrderStatus = ({ product, quantity, status, decreaseNumber }) => (
    <tr role="row" key={product.id}>
        <td>
            {product.name} <small className="muted">x{quantity}</small>
        </td>
        <td className={"text-right pr-0"}>
            {product.price} x {quantity} =
        </td>
        <td className={"pl-1"}>{product.price * quantity}€</td>
        <td className={"text-right"}>
            {status === "idle" ? (
                <span
                    className="fe fe-delete text-danger"
                    onClick={decreaseNumber}
                />
            ) : status === "loading" ? (
                <span className="fe fe-upload" />
            ) : status === "success" ? (
                <span className="text-success fe fe-check" />
            ) : (
                <span className="text-danger fe fe-alert-octagon" />
            )}
        </td>
    </tr>
);
