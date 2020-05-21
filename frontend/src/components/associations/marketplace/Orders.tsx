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
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { formatDate } from "../../../utils/format";

export const AssociationMarketplaceOrders = ({ association }) => {
    const marketplaceId = association.id;
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
            header: "Valeur",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (transaction) => transaction.value + "€",
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
            header: "Status",
            render: (transaction) => (
                <TransactionStatusSelector transaction={transaction} />
            ),
        },
    ];

    return (
        <>
            <PageTitle>Commandes</PageTitle>

            <Pagination
                render={(transactions: Transaction[], paginationControl) => (
                    <>
                        <Card>
                            <Table columns={columns} data={transactions} />
                        </Card>
                        {paginationControl}
                    </>
                )}
                apiKey={[
                    "transactions.list.admin",
                    marketplaceId,
                    { page_size: 10, ordering: "-date" },
                ]}
                apiMethod={api.transactions.list}
                config={{ refetchOnWindowFocus: false }}
                paginationControlProps={{
                    className: "justify-content-center mt-5",
                }}
            />
        </>
    );
};

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

    const newToast = useContext(ToastContext);
    const [isOpen, setIsOpen] = useState(false);
    const target = useRef(null);

    const changeStatus = (status) => {
        setIsOpen(false);
        transaction.status = status;
        api.transactions
            .patch({ id: transaction.id, status: status })
            .then((_) => {
                newToast({
                    message: "Le status a bien été modifié",
                    level: ToastLevel.Success,
                });
            })
            .catch((err) => {
                newToast({
                    message: "Erreur durant la modification : " + err,
                    level: ToastLevel.Error,
                });
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
