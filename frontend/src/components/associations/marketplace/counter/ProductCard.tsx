import { Card } from "react-bootstrap";
import React from "react";
import { decidePlural } from "../../../../utils/format";

export const ProductCard = ({ product, addToBasket, quantityOrdered }) => (
    <Card className={"mx-0 my-1"} onClick={() => addToBasket(product)}>
        <Card.Body className={"p-3 text-center"}>
            {product.name}
            <br />
            <small className="text-muted">
                {product.price}€
                {product.numberLeft > -1
                    ? ` / ${
                          product.numberLeft - (quantityOrdered || 0)
                      } ${decidePlural(
                          product.numberLeft - (quantityOrdered || 0),
                          "restant",
                          "restants"
                      )}`
                    : ""}
            </small>
        </Card.Body>
    </Card>
);
