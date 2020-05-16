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
import { Tag } from "../../utils/tags/Tag";
import { OverlayTrigger, Tooltip, Overlay } from "react-bootstrap";
import { ToastContext, ToastLevel } from "../../utils/Toast";

/*
export interface Transaction {
    id: string;
    product: Product;
    buyer: User;
    quantity: number;
    value: number;
    date: Date;
    status: TransactionStatus;
    marketplace: Marketplace;
 */

export const AssociationMarketplaceOrders = ({ association }) => {
    const marketplaceId = association.id;
    const columns = [
        {
            key: "product",
            header: "Produit",
            render: (transaction) => transaction.product.name,
        },
        {
            key: "buyer",
            header: "Utilisateur",
            render: (transaction) => transaction.buyer,
        },
        {
            key: "quantity",
            header: "Quantité",
        },
        {
            key: "value",
            header: "Valeur",
            render: (transaction) => transaction.value + "€",
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
            <Card>
                <Pagination
                    render={(
                        transactions: Transaction[],
                        paginationControl
                    ) => (
                        <>
                            <Table columns={columns} data={transactions} />
                            {paginationControl}
                        </>
                    )}
                    apiKey={["transactions.list.admin", marketplaceId, {}]}
                    apiMethod={api.transactions.list}
                    config={{ refetchOnWindowFocus: false }}
                    paginationControlProps={{
                        className: "justify-content-center mt-5",
                    }}
                />
            </Card>
        </>
    );
};

const TransactionStatusSelector = ({
    transaction,
}: {
    transaction: Transaction;
}) => {
    let statusList = [
        [TransactionStatus.Ordered, "primary", "Commandée"],
        [TransactionStatus.Cancelled, "success", "Annulée"],
        [TransactionStatus.Rejected, "danger", "Rejetée"],
        [TransactionStatus.Validated, "lime", "Validée"],
        [TransactionStatus.Delivered, "success", "Livrée"],
        [TransactionStatus.Refunded, "yellow", "Remboursée"],
    ];

    let [status, type, tag] = statusList.filter(
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
                        {isOpen ? "" : "Cliquez pour éditer"}
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
