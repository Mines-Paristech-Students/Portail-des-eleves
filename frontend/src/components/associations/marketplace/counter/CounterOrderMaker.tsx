import { api, useBetterQuery } from "../../../../services/apiService";
import React, { useContext, useState } from "react";
import { ToastContext } from "../../../utils/Toast";
import { TransactionStatus } from "../../../../models/associations/marketplace";
import { queryCache, useMutation } from "react-query";
import { Card, Col, Row } from "react-bootstrap";
import { RefundForm } from "./RefundForm";
import { ProductSearch } from "./ProductSearch";
import { OrderSummary } from "./OrderSummary";
import { Balance } from "../Balance";
import { SubscriptionForm } from "./SubscriptionForm";
import { Loading } from "../../../utils/Loading";
import { genericMutationErrorHandling } from "../../../../utils/genericMutationErrorHandling";

export const CounterOrderMaker = ({
  marketplaceId,
  customer,
  resetCustomer,
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
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

        sendErrorToast(`Erreur lors du passage de la commande : ${e}`);

        error = true;
      }
    }

    if (!error) {
      setBasket({});
      resetCustomer();
      sendSuccessToast("Commande passée avec succès");
    }

    await queryCache.invalidateQueries(["marketplace.transactions.list"]);
  };

  const [localSubscription, setLocalSubscription] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [updateSubscription] = useMutation(
    api.marketplace.subscription.update,
    {
      onSuccess: (entity) => {
        setLocalSubscription(entity.subscriber);
        sendSuccessToast("Compte modifié.");
        return queryCache.invalidateQueries([
          "marketplace.get",
          { marketplaceId },
        ]);
      },
      onError: genericMutationErrorHandling(sendErrorToast),
    }
  );

  let {
    data: subscriber,
    status,
    error,
  } = useBetterQuery(
    ["marketplace.subscription", marketplaceId, customer.id],
    api.marketplace.subscription.get
  );

  if (status === "success" && !updated) {
    setUpdated(true);
    setLocalSubscription((subscriber as { subscriber: boolean }).subscriber);
  }

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <span>Error :{" " + error}</span>
  ) : (
    <>
      <Row className="mt-4">
        <Col md={8} className="d-flex justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body className="text-center">
                <h5>{customer.id}</h5>
                <p className="h1 font-weight-bold">
                  <Balance marketplaceId={marketplaceId} user={customer} />
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Col>

        <Col md={4} className="d-flex flex-column">
          <RefundForm
            customer={customer}
            marketplaceId={marketplaceId}
            className={"float-right mt-2"}
          />

          <SubscriptionForm
            subscriber={localSubscription}
            updateSubscription={updateSubscription}
            customer={customer}
            marketplaceId={marketplaceId}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <ProductSearch
            subscriber={localSubscription}
            basket={basket}
            addToBasket={addToBasket}
            marketplaceId={marketplaceId}
          />
        </Col>

        {/* Show order summary */}
        <Col md={6}>
          <OrderSummary
            subscriber={localSubscription}
            basket={basket}
            removeFromBasket={removeFromBasket}
            makeOrder={makeOrder}
          />
        </Col>
      </Row>
    </>
  );
};
