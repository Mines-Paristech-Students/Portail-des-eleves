import React from "react";
import { ProductForm } from "./ProductForm";
import { PageTitle } from "../../utils/PageTitle";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Product } from "../../../models/associations/marketplace";

export const AssociationMarketplaceProductCreate = ({ association }) => {
    const history = useHistory();

    const marketplaceId = association.id;
    const product: Product = {
        comment: "",
        description: "",
        id: "",
        marketplace: marketplaceId,
        name: "",
        numberLeft: 10,
        orderableOnline: false,
        price: 0,
        tags: [],
    };

    return (
        <Container>
            <PageTitle>
                <span onClick={history.goBack} className={"text-primary"}>
                    <i className={"fe fe-arrow-left"} />
                </span>
                Ajouter un produit
            </PageTitle>
            <ProductForm association={association} product={product} />
        </Container>
    );
};
