import React, { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import { Link } from "react-router-dom";
import {
  decidePlural,
  formatNewLines,
  formatPrice,
} from "../../../utils/format";
import { Table } from "../../utils/table/Table";
import { Card } from "react-bootstrap";
import { SidebarSeparator, SidebarSpace } from "../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../utils/sidebar/SidebarInputSearch";
import { TagSearch } from "../../utils/tags/TagSearch";
import { AssociationLayout } from "../Layout";

export const AssociationMarketplaceProductAdministration = ({
  association,
}) => {
  const marketplaceId = association.id;

  const [searchParams, setSearchParams] = useState({});
  const [tagParams, setTagParams] = useState({});

  return (
    <AssociationLayout
      association={association}
      additionalSidebar={
        <>
          <SidebarSeparator />
          <SidebarInputSearch setParams={setSearchParams} />
          <SidebarSpace />
          <TagSearch
            setTagParams={setTagParams}
            tagsQueryParams={{
              page_size: 1000,
              namespace__scoped_to_model: "association",
              namespace__scoped_to_pk: marketplaceId,
              related_to: "product",
            }}
          />
        </>
      }
    >
      <div className="d-flex align-items-center">
        <PageTitle>Produits</PageTitle>
        <Link
          to={`/associations/${marketplaceId}/magasin/produits/nouveau`}
          className={"btn btn-success btn-sm ml-auto"}
        >
          <span className={"fe fe-plus"} /> Ajouter un produit
        </Link>
      </div>

      <Pagination
        apiKey={[
          "products.list",
          marketplaceId,
          { page_size: 8, ...tagParams, ...searchParams },
        ]}
        apiMethod={api.products.list}
        paginationControlProps={{
          className: "justify-content-center mt-5",
        }}
        render={(products, paginationControls) => (
          <>
            <Card>
              <Table columns={columns(marketplaceId)} data={products} />
            </Card>
            {paginationControls}
          </>
        )}
      />
    </AssociationLayout>
  );
};

const columns = (marketplaceId) => [
  {
    key: "product",
    header: "Produit",
    render: (product) => product.name,
  },
  {
    key: "price",
    header: "Prix",
    cellClassName: "text-muted",
    render: (product) => formatPrice(product.price),
  },
  {
    key: "description",
    header: "Description",
    render: (product) => formatNewLines(product.description),
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
        <span className="fe fe-edit-2" /> Modifier
      </Link>
    ),
    headerClassName: "text-right",
    cellClassName: "text-right",
  },
];
