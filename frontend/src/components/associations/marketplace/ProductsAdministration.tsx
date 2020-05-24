import React from "react";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import { Product } from "./Product";
import { Link } from "react-router-dom";

export const AssociationMarketplaceProductAdministration = ({
    association,
}) => {
    const marketplaceId = association.id;
    return (
        <>
            <PageTitle>Produits</PageTitle>
            <Row>
                <Pagination
                    apiKey={["products.list", marketplaceId, { page_size: 8 }]}
                    apiMethod={api.products.list}
                    render={(products, controlbar) => (
                        <>
                            <Row>
                                {products.map((product) => (
                                    <Product
                                        product={product}
                                        key={product.id}
                                        additionalContent={
                                            <Link
                                                to={`/associations/${marketplaceId}/magasin/produits/${product.id}/modifier`}
                                            >
                                                Modifier
                                            </Link>
                                        }
                                    />
                                ))}
                            </Row>
                            {controlbar}
                        </>
                    )}
                />
            </Row>
        </>
    );
};
