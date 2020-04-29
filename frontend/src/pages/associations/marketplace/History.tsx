import React, { useContext } from "react";
import { api, useBetterQuery } from "../../../services/apiService";
import { LoadingAssociation } from "../Loading";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../../utils/common";
import { UserContext } from "../../../services/authService";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../../utils/pagination";

export const AssociationMarketplaceHistory = ({ association }) => {
    const user = useContext(UserContext);
    const marketplaceId = association.id;

    return (
        <Pagination
            apiKey={"marketplace.transactions.list"}
            apiMethod={api.transactions.list}
            apiParams={[marketplaceId, user]}
            render={(transactions, paginationControl) => (
                <Container>
                    <div className={"float-right"}>
                        <a
                            href={
                                "/associations/" +
                                marketplaceId +
                                "/marketplace/"
                            }
                            className={"btn btn-primary"}
                        >
                            <i className={"fe fe-book-open"} /> Magasin
                        </a>
                    </div>
                    <PageTitle>Mon historique</PageTitle>

                    {transactions.length !== 0 ? (
                        <>
                            {paginationControl}
                            <TransactionsTable transactions={transactions} />
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

const TransactionsTable = ({ transactions }) => {
    return (
        <Card>
            <table className="table card-table table-vcenter">
                <tbody>
                    {transactions.map((transaction, index) => {
                        return transaction.product !== null ? (
                            <PurchaseTransactionLine
                                key={index}
                                transaction={transaction}
                            />
                        ) : (
                            <RefundTransactionLine
                                key={index}
                                transaction={transaction}
                            />
                        );
                    })}
                </tbody>
            </table>
        </Card>
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

const PurchaseTransactionLine = ({ transaction }) => {
    let status = <p />;

    if (transaction.status === "ORDERED") {
        status = <span className="tag tag-blue">Commandée</span>;
    }
    if (transaction.status === "VALIDATED") {
        status = <span className="tag tag-lime">Validée</span>;
    }
    if (transaction.status === "DELIVERED") {
        status = <span className="tag tag-green">Délivrée</span>;
    }
    if (transaction.status === "CANCELLED") {
        status = <span className="tag tag-red">Annulée</span>;
    }
    if (transaction.status === "REFUNED") {
        status = <span className="tag tag-yellow">Remboursée</span>;
    }

    return (
        <tr>
            <td>
                <strong>{transaction.product.name}</strong>
            </td>
            <td className="text-center text-muted d-none d-md-table-cell text-nowrap">
                Quantité : {transaction.quantity}
            </td>
            <td className="text-right">
                <strong>{transaction.value}€</strong>
            </td>
            <td className="text-right">{status}</td>
        </tr>
    );
};

const RefundTransactionLine = ({ transaction }) => {
    /* If the user put money  on their account */
    let status = <p />;
    if (transaction.status === "FUNDED") {
        status = <span className="tag tag-blue">Versé</span>;
    } else if (transaction.status === "REFUNED") {
        status = <span className="tag tag-yellow">Remboursé</span>;
    }

    return (
        <tr>
            <td colSpan={2}>Argent versé sur le compte :</td>
            <td className="text-center" colSpan={2}>
                <strong>{transaction.value}€</strong>
            </td>
            <td className="text-right">{status}</td>
            <td className="text-center">{transaction.date}</td>
        </tr>
    );
};
