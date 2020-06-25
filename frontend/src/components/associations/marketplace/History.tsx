import React, { useContext } from "react";
import { api } from "../../../services/apiService";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import { UserContext } from "../../../services/authService";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../utils/Pagination";
import { formatDate } from "../../../utils/format";
import {
  Funding,
  FundingStatus,
  TransactionStatus,
} from "../../../models/associations/marketplace";
import { Table } from "../../utils/table/Table";
import { Link } from "react-router-dom";
import { Balance } from "./Balance";

export const AssociationMarketplaceHistory = ({ association }) => {
  const user = useContext(UserContext);
  const marketplaceId = association.id;

  return (
    <Container>
      <div className={"float-right mt-2 mr-3"}>
        <span className="tag align-middle mr-2">
          Mon solde : <Balance marketplaceId={marketplaceId} user={user} />
        </span>
        <Link
          to={"/associations/" + marketplaceId + "/magasin"}
          className={"btn btn-primary btn-sm"}
        >
          <span className={"fe fe-book-open"} /> Magasin
        </Link>
      </div>
      <TransactionHistory marketplaceId={marketplaceId} user={user} />
      <FundingHistory marketplaceId={marketplaceId} user={user} />
    </Container>
  );
};

const TransactionHistory = ({ marketplaceId, user }) => {
  const columns = [
    {
      key: "product",
      header: "Produit",
      render: (transaction) => (
        <>
          <strong>{transaction.product.name}</strong>{" "}
          <span className="text-muted">x {transaction.quantity}</span>
        </>
      ),
    },
    {
      key: "value",
      header: "Montant",
      render: (transaction) => <strong>{transaction.value} €</strong>,
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "date",
      header: "Date",
      render: (transaction) => formatDate(new Date(transaction.date)),
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "status",
      header: "Statut",
      render: (transaction) => {
        let status = {};

        status[TransactionStatus.Ordered] = (
          <span className="tag tag-blue">Commandée</span>
        );

        status[TransactionStatus.Validated] = (
          <span className="tag tag-lime">Validée</span>
        );

        status[TransactionStatus.Delivered] = (
          <span className="tag tag-green">Délivrée</span>
        );

        status[TransactionStatus.Cancelled] = (
          <span className="tag tag-red">Annulée</span>
        );

        status[TransactionStatus.Refunded] = (
          <span className="tag tag-yellow">Remboursée</span>
        );

        status[TransactionStatus.Rejected] = (
          <span className="tag tag-red">Refusée</span>
        );

        return status[transaction.status];
      },
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
  ];

  return (
    <Pagination
      apiKey={[
        "marketplace.transactions.list",
        marketplaceId,
        { page_size: 10, buyer: user?.id },
      ]}
      apiMethod={api.transactions.list}
      render={(transactions, paginationControl) => (
        <Container>
          <PageTitle>Mes commandes</PageTitle>

          {transactions.length !== 0 ? (
            <>
              <Card>
                <Table columns={columns} data={transactions} />
              </Card>
              {paginationControl}
            </>
          ) : (
            <NoTransactionMessage />
          )}
        </Container>
      )}
    />
  );
};

const NoTransactionMessage = () => (
  <Card>
    <Card.Body>
      <p className="text-center">
        Vous n'avez fait aucune commande jusqu'à maintenant
      </p>
    </Card.Body>
  </Card>
);

const FundingHistory = ({ marketplaceId, user }) => {
  const columns = [
    {
      key: "label",
      header: "",
      render: (funding) => "Argent versé sur le compte :",
    },
    {
      key: "value",
      header: "Montant",
      render: (funding) => funding.value + " €",
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "date",
      header: "Date",
      render: (funding) => formatDate(new Date(funding.date)),
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "status",
      header: "Statut",
      render: (funding: Funding) =>
        funding.status === FundingStatus.Funded ? (
          <span className="tag tag-blue">Versé</span>
        ) : funding.status === FundingStatus.Refunded ? (
          <span className="tag tag-yellow">Remboursé</span>
        ) : null,
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
  ];

  return (
    <Pagination
      apiKey={[
        "marketplace.funding.list",
        marketplaceId,
        { page_size: 10, user: user?.id },
      ]}
      apiMethod={api.fundings.list}
      render={(fundings, paginationControl) => (
        <Container>
          <PageTitle>Mes dépôts</PageTitle>

          {fundings.length !== 0 ? (
            <>
              <Card>
                <Table columns={columns} data={fundings} />
              </Card>
              {paginationControl}
            </>
          ) : (
            <NoFundingMessage />
          )}
        </Container>
      )}
    />
  );
};

const NoFundingMessage = () => (
  <Card>
    <Card.Body>
      <p className="text-center">
        Vous n'avez jamais rempli votre compte jusqu'à maintenant
      </p>
    </Card.Body>
  </Card>
);
