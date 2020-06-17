import React from "react";
import { api, useBetterQuery } from "../../../services/apiService";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";
import { Product } from "../../../models/associations/marketplace";
import { Link, useParams } from "react-router-dom";
import { ProductForm } from "./ProductForm";
import { PageTitle } from "../../utils/PageTitle";
import { Container } from "react-bootstrap";

export const AssociationMarketplaceProductEdit = ({ association }) => {
  const { productId } = useParams<{ productId: string }>();
  const marketplaceId = association.id;

  const { data: product, status, error } = useBetterQuery<Product>(
    ["product.get", productId],
    api.products.get
  );

  return status === "loading" ? (
    <Loading className="mt-5" />
  ) : error ? (
    <Error detail={error} />
  ) : product ? (
    <Container>
      <PageTitle>
        <Link
          to={`/associations/${marketplaceId}/magasin/produits`}
          className={"text-primary"}
        >
          <i className={"fe fe-arrow-left"} />
        </Link>
        Modifier le produit
      </PageTitle>
      <ProductForm association={association} product={product} />
    </Container>
  ) : null;
};
