import { Button, Card } from "react-bootstrap";
import React from "react";
import { Table } from "../../../utils/table/Table";

export const OrderSummary = ({ basket, removeFromBasket, makeOrder }) => (
  <Card>
    <Card.Header>
      <Card.Title>Commande</Card.Title>
    </Card.Header>
    {Object.keys(basket).length > 0 ? (
      <Table
        columns={columns(removeFromBasket)}
        data={Object.keys(basket).map((key) => basket[key])}
      />
    ) : (
      <Card.Body className={"py-2 text-muted"}>
        <em>Aucun produit commandé pour l'instant</em>
      </Card.Body>
    )}
    <Card.Footer>
      {Object.keys(basket).length > 0 && (
        <Button
          variant={"success"}
          size={"sm"}
          className="float-right"
          onClick={makeOrder}
        >
          <span className="fe fe-shopping-cart" /> Passer la commande
        </Button>
      )}
      <strong>
        Total :{" "}
        {Object.keys(basket)
          .map((key) => basket[key])
          .map(({ product, quantity }) => product.price * quantity)
          .reduce((acc, val) => acc + val, 0)}
        €
      </strong>
    </Card.Footer>
  </Card>
);

const columns = (decreaseNumber) => [
  {
    key: "product",
    header: "Produit",
    render: ({ product, quantity, status }) => (
      <>
        {product.name} <span className="text-muted">x {quantity}</span>
      </>
    ),
  },
  {
    key: "value",
    header: "Montant",
    render: ({ product, quantity, status }) => `${product.price} x ${quantity}`,
    headerClassName: "text-right",
    cellClassName: "text-right",
  },
  {
    key: "actions",
    header: "",
    render: ({ product, quantity, status }) =>
      status === "idle" ? (
        <span
          className="fe fe-delete text-danger"
          onClick={() => decreaseNumber(product)}
        />
      ) : status === "loading" ? (
        <span className="fe fe-upload" />
      ) : status === "success" ? (
        <span className="text-success fe fe-check" />
      ) : (
        <span className="text-danger fe fe-alert-octagon" />
      ),
    headerClassName: "text-right",
    cellClassName: "text-right",
  },
];
