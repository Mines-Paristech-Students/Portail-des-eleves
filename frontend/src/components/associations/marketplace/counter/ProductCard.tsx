import { Card } from "react-bootstrap";
import React from "react";
import { decidePlural, formatPrice } from "../../../../utils/format";

export const ProductCard = ({
  product,
  subscriber,
  addToBasket,
  quantityOrdered,
  className = "",
}) => (
  <Card
    className={`mx-0 my-1 ${className}`}
    onClick={() => addToBasket(product)}
  >
    <Card.Body className={"p-3 text-center"}>
      {product.name}
      <br />
      <small className="text-muted">
        {subscriber && product.priceForSubscribers
          ? formatPrice(product.priceForSubscribers)
          : formatPrice(product.price)}
        {product.numberLeft > -1
          ? ` / ${product.numberLeft - (quantityOrdered || 0)} ${decidePlural(
              product.numberLeft - (quantityOrdered || 0),
              "restant",
              "restants"
            )}`
          : ""}
      </small>
    </Card.Body>
  </Card>
);
