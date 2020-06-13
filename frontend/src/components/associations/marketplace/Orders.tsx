import React, { useContext, useRef, useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../utils/Pagination";
import { Table } from "../../utils/table/Table";
import { api } from "../../../services/apiService";
import {
    Transaction,
    TransactionStatus,
} from "../../../models/associations/marketplace";
import { OverlayTrigger, Tooltip, Overlay } from "react-bootstrap";
import { ToastContext } from "../../utils/Toast";
import { formatDate, formatPrice } from "../../../utils/format";
import { SidebarSeparator } from "../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../utils/sidebar/SidebarInputSearch";
import { AssociationLayout } from "../Layout";
import { SidebarUserSearch } from "../../utils/sidebar/SidebarUserSearch";
import { SidebarStatusSelector } from "../../utils/sidebar/SidebarStatusSelector";

const orderStatus = [
    { value: "ORDERED", label: "Commandé" },
    { value: "CANCELLED", label: "Annulé" },
    { value: "REJECTED", label: "Refusé" },
    { value: "VALIDATED", label: "Validé" },
    { value: "DELIVERED", label: "Livrée" },
    { value: "REFUNDED", label: "Remboursé" },
];

const defaultStatusState = {
    ORDERED: false,
    CANCELLED: false,
    REJECTED: false,
    VALIDATED: false,
    DELIVERED: false,
    REFUNDED: false,
};

export const AssociationMarketplaceOrders = ({ association }) => {
    const marketplaceId = association.id;

    const [searchParams, setSearchParams] = useState({});
    const [userParams, setUserParams] = useState({});
    const [statusParams, setStatusParams] = useState({});

    return (
        <AssociationLayout
            association={association}
            additionalSidebar={
                <>
                    <SidebarSeparator />
                    <SidebarUserSearch
                        setParams={setUserParams}
                        apiKey={"buyer"}
                    />
                    <SidebarInputSearch
                        setParams={setSearchParams}
                        placeholder={"Chercher un produit"}
                    />
                    <SidebarStatusSelector
                        setParams={setStatusParams}
                        statuses={orderStatus}
                        defaultState={defaultStatusState}
                    />
                </>
            }
        >
            <PageTitle>Commandes</PageTitle>

            <Pagination
                apiKey={[
                    "transactions.list.admin",
                    marketplaceId,
                    {
                        page_size: 10,
                        ordering: "-date",
                        ...searchParams,
                        ...userParams,
                        ...statusParams,
                    },
                ]}
                apiMethod={api.transactions.list}
                config={{ refetchOnWindowFocus: false }}
                paginationControlProps={{
                    className: "justify-content-center mt-5",
                }}
                render={(transactions: Transaction[], paginationControl) => (
                    <>
                        {transactions.length > 0 ? (
                            <>
                                <Card>
                                    <Table
                                        columns={columns}
                                        data={transactions}
                                    />
                                </Card>
                                {paginationControl}
                            </>
                        ) : (
                            <Card>
                                <p
                                    className={
                                        "text-center text-muted lead my-3"
                                    }
                                >
                                    Aucun résultat
                                </p>
                            </Card>
                        )}
                    </>
                )}
            />
        </AssociationLayout>
    );
};

const columns = [
    {
        key: "product",
        header: "Produit",
        render: (transaction) => transaction.product.name,
    },
    {
        key: "quantity",
        header: "Quantité",
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
        key: "value",
        header: "Montant",
        headerClassName: "text-right",
        cellClassName: "text-right",
        render: (transaction) => formatPrice(transaction.value),
    },
    {
        key: "buyer",
        header: "Utilisateur",
        render: (transaction) => transaction.buyer,
        headerClassName: "text-center",
        cellClassName: "text-center",
    },
    {
        key: "status",
        header: "Statut",
        render: (transaction) => (
            <TransactionStatusSelector transaction={transaction} />
        ),
    },
];

const TransactionStatusSelector = ({
    transaction,
}: {
    transaction: Transaction;
}) => {
    const statusList = [
        [TransactionStatus.Ordered, "primary", "Commandée"],
        [TransactionStatus.Cancelled, "success", "Annulée"],
        [TransactionStatus.Rejected, "danger", "Rejetée"],
        [TransactionStatus.Validated, "lime", "Validée"],
        [TransactionStatus.Delivered, "success", "Livrée"],
        [TransactionStatus.Refunded, "yellow", "Remboursée"],
    ];

    const [, type, tag] = statusList.filter(
        (item) => item[0] === transaction.status
    )[0];

    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
    const [isOpen, setIsOpen] = useState(false);
    const target = useRef(null);

    const changeStatus = (status) => {
        setIsOpen(false);
        transaction.status = status;
        api.transactions
            .patch({ id: transaction.id, status: status })
            .then((_) => {
                sendSuccessToast("Le statut a bien été modifié");
            })
            .catch((err) => {
                sendErrorToast("Erreur durant la modification : " + err);
            });
    };

    return (
        <>
            <OverlayTrigger
                placement={"bottom"}
                key={`tooltip-status-${transaction.id}`}
                overlay={
                    <Tooltip id={`tooltip-status-${transaction.id}-help`}>
                        {isOpen ? "" : "Cliquez pour modifier"}
                    </Tooltip>
                }
            >
                <div
                    ref={target}
                    className={"tag tag-" + type}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {tag}
                </div>
            </OverlayTrigger>
            <Overlay target={target.current} show={isOpen} placement="bottom">
                {(props) => (
                    <Tooltip id={`tooltip-status-${transaction.id}`} {...props}>
                        <div className="tags">
                            {statusList
                                .filter(
                                    (item) => item[0] !== transaction.status
                                )
                                .map(([status, type, tag]) => (
                                    <span
                                        onClick={() => changeStatus(status)}
                                        className={"tag tag-" + type}
                                        key={status}
                                    >
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    </Tooltip>
                )}
            </Overlay>
        </>
    );
};
