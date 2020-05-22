import React from "react";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import { Product } from "./common/Product";
import { Link } from "react-router-dom";

export const AssociationMarketplaceProductAdministration = ({
    association,
}) => {
    let marketplaceId = association.id;
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
                                                to={`/associations/${marketplaceId}/marketplace/products/${product.id}/edit`}
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
