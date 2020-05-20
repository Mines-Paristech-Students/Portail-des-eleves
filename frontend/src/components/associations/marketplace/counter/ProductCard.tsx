import { Card } from "react-bootstrap";
import React from "react";
import { decidePlural } from "../../../../utils/format";

export const ProductCard = ({ product, addToBasket, quantityOrdered }) => (
    <div className={"col-lg-3 col-sm-4 col-6 p-1"} key={product.id}>
        <Card className={"m-0"} onClick={() => addToBasket(product)}>
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
    </div>
);
