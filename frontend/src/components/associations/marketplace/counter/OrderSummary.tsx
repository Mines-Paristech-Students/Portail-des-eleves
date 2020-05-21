import { Button, Card } from "react-bootstrap";
import React from "react";
import { OrderStatus } from "./OrderStatus";

export const OrderSummary = ({ basket, removeFromBasket, makeOrder }) => {
    if (Object.keys(basket).length === 0) {
        return null;
    }

    return (
        <>
            <Card className={"mt-5"}>
                <Card.Header>
                    <Card.Title>Commande</Card.Title>
                </Card.Header>
                <div className="table-responsive">
                    <div className="dataTables_wrapper no-footer">
                        <table
                            className="table card-table table-vcenter datatable dataTable no-footer table-striped"
                            role="grid"
                        >
                            <tbody>
                                {Object.keys(basket)
                                    .map((key) => basket[key])
                                    .map(({ product, quantity, status }) => (
                                        <OrderStatus
                                            key={product.id}
                                            product={product}
                                            quantity={quantity}
                                            status={status}
                                            decreaseNumber={() =>
                                                removeFromBasket(product)
                                            }
                                        />
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Card.Footer>
                    <Button
                        variant={"success"}
                        size={"sm"}
                        className="float-right"
                        onClick={makeOrder}
                    >
                        <span className="fe fe-shopping-cart" /> Passer la
                        commande
                    </Button>
                    <strong>
                        Total :{" "}
                        {Object.keys(basket)
                            .map((key) => basket[key])
                            .map(
                                ({ product, quantity }) =>
                                    product.price * quantity
                            )
                            .reduce((acc, val) => acc + val, 0)}
                        €
                    </strong>
                </Card.Footer>
            </Card>
        </>
    );
};
