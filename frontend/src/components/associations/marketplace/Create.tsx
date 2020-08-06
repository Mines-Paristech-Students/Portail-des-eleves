import React from "react";
import { ProductForm } from "./ProductForm";
import { PageTitle } from "../../utils/PageTitle";
import { Container } from "react-bootstrap";
import { Product } from "../../../models/associations/marketplace";
import { ArrowLink } from "../../utils/ArrowLink";

export const AssociationMarketplaceProductCreate = ({ association }) => {
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
        <ArrowLink to={`/associations/${association.id}/magasin/produits`} />
        Ajouter un produit
      </PageTitle>
      <ProductForm association={association} product={product} />
    </Container>
  );
};
