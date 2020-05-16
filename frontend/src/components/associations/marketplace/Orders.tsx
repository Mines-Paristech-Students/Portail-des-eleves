import React from "react";
import { PageTitle } from "../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../utils/Pagination";
import { Poll } from "../../../models/polls";
import { PollEditModal } from "../../polls/polls_table/PollEditModal";
import { Table } from "../../utils/table/Table";
import { api } from "../../../services/apiService";
import { PollsLoading } from "../../polls/PollsLoading";
import { PollsError } from "../../polls/PollsError";
import { transactions } from "../../../services/api/transactions";
import { Transaction } from "../../../models/associations/marketplace";
import { Sorting } from "../../utils/table/sorting";

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

export const AssociationMarketplaceOrders = (association) => {
    const columns = [
        {
            key: "product",
            header: "Produit",
            render: (product) => (product.name),
            // sorting?: Sorting;
            // onChangeSorting?: (newSorting?: Sorting) => void;
            // headerClassName?: string;
            // cellClassName?: string;
        }
    ]

    return (
        <>
            <PageTitle>Commandes</PageTitle>
            <Card>
                <Card.Body>
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
                        apiKey={["transactions.list"]}
                        apiMethod={api.transactions.list}
                        config={{ refetchOnWindowFocus: false }}
                        paginationControlProps={{
                            className: "justify-content-center mt-5",
                        }}
                    />
                </Card.Body>
            </Card>
        </>
    );
};
