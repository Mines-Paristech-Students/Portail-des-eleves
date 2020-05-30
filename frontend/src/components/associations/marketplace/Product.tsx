import React from "react";
import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { decidePlural, formatNewLines, formatPrice } from "../../../utils/format";

export const Product = ({ product, additionalContent }) => (
    <Col xs={12} md={6}>
        <Card>
            <Card.Body>
                <Card.Title className="card-title mb-4" as={"h4"}>
                    {product.name}
                </Card.Title>
                <Card.Subtitle>
                    {product.numberLeft > -1
                        ? product.numberLeft +
                          " " +
                          decidePlural(
                              product.numberLeft,
                              "restant",
                              "restants"
                          )
                        : ""}
                </Card.Subtitle>
                <p>{formatNewLines(product.description)}</p>

                <div className="mt-5 d-flex align-items-center">
                    <div className={"product-price mr-3"}>
                        <strong>{formatPrice(product.price)}</strong>
                    </div>
                    <div className="ml-auto">{additionalContent}</div>
                </div>
            </Card.Body>
        </Card>
    </Col>
);
