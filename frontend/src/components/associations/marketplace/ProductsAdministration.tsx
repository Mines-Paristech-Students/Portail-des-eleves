import React from "react";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import { Product } from "./Product";
import { Link } from "react-router-dom";
import { decidePlural } from "../../../utils/format";
import { Table } from "../../utils/table/Table";
import { Card } from "react-bootstrap";

export const AssociationMarketplaceProductAdministration = ({
    association,
}) => {
    const marketplaceId = association.id;
    return (
        <>
            <PageTitle>Produits</PageTitle>

            <Pagination
                apiKey={["products.list", marketplaceId, { page_size: 8 }]}
                apiMethod={api.products.list}
                paginationControlProps={{
                    className: "justify-content-center mt-5",
                }}
                render={(products, paginationControls) => (
                    <>
                        <Card>
                            <Table
                                columns={columns(marketplaceId)}
                                data={products}
                            />
                        </Card>
                        {paginationControls}
                    </>
                )}
            />
        </>
    );
};

const columns = (marketplaceId) => [
    {
        key: "product",
        header: "Product",
        render: (product) => product.name,
    },
    {
        key: "price",
        header: "Prix",
        cellClassName: "text-muted",
        render: (product) => product.price + "€",
    },
    {
        key: "description",
        header: "Description",
        cellClassName: "flex-shrink-1",
    },
    {
        key: "stocks",
        header: "Stocks",
        cellClassName: "text-muted",
        render: (product) =>
            product.numberLeft > -1
                ? ` ${product.numberLeft} ${decidePlural(
                      product.numberLeft,
                      "restant",
                      "restants"
                  )}`
                : "Stocks infinis",
    },
    {
        key: "action",
        header: "Actions",
        render: (product) => (
            <Link
                to={`/associations/${marketplaceId}/magasin/produits/${product.id}/modifier`}
            >
                Modifier
            </Link>
        ),
        headerClassName: "text-right",
        cellClassName: "text-right",
    },
];
