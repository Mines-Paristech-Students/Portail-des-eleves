import React, { useContext } from "react";
import { api } from "../../../services/apiService";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import { UserContext } from "../../../services/authService";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../utils/Pagination";
import { formatDate } from "../../../utils/format";
import { TransactionStatus } from "../../../models/associations/marketplace";

export const AssociationMarketplaceHistory = ({ association }) => {
    const user = useContext(UserContext);
    const marketplaceId = association.id;

    return (
        <>
            <div className={"float-right"}>
                <a
                    href={"/associations/" + marketplaceId + "/marketplace"}
                    className={"btn btn-primary"}
                >
                    <i className={"fe fe-book-open"} /> Magasin
                </a>
            </div>
            <TransactionHistory marketplaceId={marketplaceId} user={user} />
            <FundingHistory marketplaceId={marketplaceId} user={user} />
        </>
    );
};

// Transactions informations
const TransactionHistory = ({ marketplaceId, user }) => (
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

const TransactionsTable = ({ transactions }) => {
    return (
        <Card>
            <table className="table card-table table-vcenter">
                <tbody>
                    {transactions.map((transaction, index) => (
                        <PurchaseTransactionLine
                            key={index}
                            transaction={transaction}
                        />
                    ))}
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

    if (transaction.status === TransactionStatus.Ordered) {
        status = <span className="tag tag-blue">Commandée</span>;
    }
    if (transaction.status === TransactionStatus.Validated) {
        status = <span className="tag tag-lime">Validée</span>;
    }
    if (transaction.status === TransactionStatus.Delivered) {
        status = <span className="tag tag-green">Délivrée</span>;
    }
    if (transaction.status === TransactionStatus.Cancelled) {
        status = <span className="tag tag-red">Annulée</span>;
    }
    if (transaction.status === TransactionStatus.Refunded) {
        status = <span className="tag tag-yellow">Remboursée</span>;
    }
    if (transaction.status === TransactionStatus.Rejected) {
        status = <span className="tag tag-red">Refusée</span>;
    }

    return (
        <tr>
            <td>
                <strong>{transaction.product.name}</strong>{" "}
                <span className="text-muted">x{transaction.quantity}</span>
            </td>
            <td className="text-center">
                <strong>{transaction.value}€</strong>
            </td>
            <td className="text-right">
                {formatDate(new Date(transaction.date))}
            </td>
            <td className="text-right">{status}</td>
        </tr>
    );
};

// Funding informations
const FundingHistory = ({ marketplaceId, user }) => {
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
                            <FundingTable fundings={fundings} />
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

const FundingTable = ({ fundings }) => {
    return (
        <Card>
            <table className="table card-table table-vcenter">
                <tbody>
                    {fundings.map((funding, index) => (
                        <FundingLine key={index} funding={funding} />
                    ))}
                </tbody>
            </table>
        </Card>
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

const FundingLine = ({ funding }) => {
    /* If the user put money  on their account */
    let status = <p />;
    if (funding.status === "FUNDED") {
        status = <span className="tag tag-blue">Versé</span>;
    } else if (funding.status === "REFUNED") {
        status = <span className="tag tag-yellow">Remboursé</span>;
    }

    return (
        <tr>
            <td>Argent versé sur le compte :</td>
            <td className={"text-center"}>
                <strong>{funding.value}€</strong>
            </td>
            <td className="text-center">
                {formatDate(new Date(funding.date))}
            </td>
            <td className="text-right">{status}</td>
        </tr>
    );
};
