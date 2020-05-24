import { api, useBetterQuery } from "../../../../services/apiService";
import React, { useContext, useState } from "react";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { TransactionStatus } from "../../../../models/associations/marketplace";
import { queryCache } from "react-query";
import { Card, Col, Row } from "react-bootstrap";
import { RefundForm } from "./RefundForm";
import { ProductSearch } from "./ProductSearch";
import { OrderSummary } from "./OrderSummary";

export const CounterOrderMaker = ({
    marketplaceId,
    customer,
    resetCustomer,
}) => {
    const {
        data: balance,
        status: balanceStatus,
        error: balanceError,
    } = useBetterQuery(
        ["marketplace.balance", marketplaceId, customer.id],
        api.marketplace.balance.get
    );

    const newToast = useContext(ToastContext);
    const [basket, setBasket] = useState<object>({});

    const addToBasket = (product) => {
        let newBasket = { ...basket };
        if (!newBasket.hasOwnProperty(product.id)) {
            newBasket[product.id] = {
                product: product,
                quantity: 0,
                status: "idle",
            };
        }

        if (
            product.numberLeft >= newBasket[product.id].quantity + 1 ||
            product.numberLeft === -1 // unlimited
        ) {
            newBasket[product.id].quantity += 1;
        }
        setBasket(newBasket);
    };

    const removeFromBasket = (product) => {
        let newBasket = { ...basket };
        newBasket[product.id].quantity -= 1;

        if (newBasket[product.id].quantity <= 0) {
            delete newBasket[product.id];
        }

        setBasket(newBasket);
    };

    const makeOrder = async () => {
        const orders = Object.keys(basket).map((key) => basket[key]);
        let error = false;

        for (let order of orders) {
            let { product, quantity, status } = order;

            if (status === "success") {
                continue;
            }

            let newBasket = { ...basket };
            newBasket[product.id].status = "loading";
            setBasket(newBasket);

            try {
                await api.transactions.create(
                    product,
                    quantity,
                    customer,
                    TransactionStatus.Delivered
                );
                let newBasket = { ...basket };
                newBasket[product.id].status = "success";
                setBasket(newBasket);
            } catch (e) {
                let newBasket = { ...basket };
                newBasket[product.id].status = "error";
                setBasket(newBasket);

                newToast({
                    message: `Erreur lors du passage de la commande : ${e}`,
                    level: ToastLevel.Error,
                });

                error = true;
            }
        }

        if (!error) {
            setBasket({});
            resetCustomer();
            newToast({
                message: "Commande passée avec succès",
                level: ToastLevel.Success,
            });
        }

        await queryCache.refetchQueries("marketplace.transactions.list");
    };

    const basketIsEmpty = Object.keys(basket).length === 0;

    return (
        <>
            <div className="d-flex justify-content-center mt-4">
                <Col md={"6"}>
                    <Card>
                        <Card.Body className="text-center">
                            <h5>{customer.id}</h5>
                            <div className="display-2 font-weight-bold">
                                {balanceStatus === "loading" ? (
                                    <em>Chargement</em>
                                ) : balanceStatus === "error" ? (
                                    <em>Erreur {balanceError} : balance</em>
                                ) : (
                                    `${
                                        (balance as { balance: number }).balance
                                    }€`
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </div>

            <RefundForm customer={customer} marketplaceId={marketplaceId} />

            <Row>
                <Col md={basketIsEmpty ? 12 : 6}>
                    <ProductSearch
                        basket={basket}
                        addToBasket={addToBasket}
                        marketplaceId={marketplaceId}
                        compressed={Object.keys(basket).length > 0}
                    />
                </Col>

                {/* Show order summary */}
                {!basketIsEmpty && (
                    <Col md={6}>
                        <OrderSummary
                            basket={basket}
                            removeFromBasket={removeFromBasket}
                            makeOrder={makeOrder}
                        />
                    </Col>
                )}
            </Row>
        </>
    );
};
