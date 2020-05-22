import React from "react";
import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { decidePlural } from "../../../../utils/format";

export const Product = ({ product, additionalContent }) => (
    <Col xs={12} md={6}>
        <Card>
            <Card.Body>
                <Card.Title className="card-title">
                    {product.name}{" "}
                    <span className={"text-muted"}>
                        {product.price} €
                        <br />
                        <small className={"mt-1"}>
                            {product.numberLeft > -1
                                ? product.numberLeft +
                                  " " +
                                  decidePlural(
                                      product.numberLeft,
                                      "restant",
                                      "restants"
                                  )
                                : ""}
                        </small>
                    </span>
                </Card.Title>
                <div className="card-subtitle">{product.description}</div>
                {additionalContent}
            </Card.Body>
        </Card>
    </Col>
);
