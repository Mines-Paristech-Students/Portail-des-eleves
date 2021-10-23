import React, { useContext, useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { api, useBetterQuery } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import { Pagination } from "../../utils/Pagination";
import { Instructions } from "../../utils/Instructions";
import { TagSearch } from "../../utils/tags/TagSearch";
import { AssociationLayout } from "../Layout";
import { SidebarInputSearch } from "../../utils/sidebar/SidebarInputSearch";
import { SidebarSeparator, SidebarSpace } from "../../utils/sidebar/Sidebar";
import { Card } from "react-bootstrap";
import { ToastContext } from "../../utils/Toast";
import { UserContext } from "../../../services/authService";
import { Product } from "./Product";
import { QuantitySelect } from "./QuantitySelect";
import { Link } from "react-router-dom";
import { Balance } from "./Balance";
import { Loading } from "../../utils/Loading";

export const AssociationMarketplaceHome = ({ association }) => {
  const marketplaceId = association.id;

  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const user = useContext(UserContext);
  const { data: subscriber, status } = useBetterQuery(
    ["marketplace.subscription", marketplaceId, user?.id],
    api.marketplace.subscription.get
  );

  const makeOrder = (product, quantity) => {
    api.transactions
      .create(product, quantity, user)
      .then((_) => {
        sendSuccessToast("La commande a bien été passée");
      })
      .catch((err) => {
        sendErrorToast("Erreur durant la commande : " + err);
      });
  };

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
      {status === "success" ? (
        <Container>
          <div className="d-flex align-items-center">
            <PageTitle>Magasin </PageTitle>
            <div className={"ml-auto"}>
              <span className="tag align-middle mr-2">
                {(subscriber as { subscriber: Boolean }).subscriber
                  ? "Cotisant"
                  : "Non cotisant"}
              </span>
              <span className="tag align-middle mr-2">
                Mon solde :&nbsp;
                <Balance marketplaceId={marketplaceId} user={user} />
              </span>
              <Link
                to={`/associations/${marketplaceId}/magasin/historique/`}
                className={"btn btn-primary btn-sm"}
              >
                <span className={"fe fe-book-open"} /> Historique
              </Link>
            </div>
          </div>

          <ProductsPagination
            association={association}
            subscriber={(subscriber as { subscriber: Boolean }).subscriber}
            queryParams={{ ...tagParams, ...searchParams }}
            makeOrder={makeOrder}
          />
        </Container>
      ) : (
        <Loading />
      )}
    </AssociationLayout>
  );
};

const ProductsPagination = ({
  association,
  subscriber,
  queryParams,
  makeOrder,
}) => (
  <Pagination
    apiKey={["products.list", association.id, { ...queryParams, page_size: 8 }]}
    apiMethod={api.products.list}
    paginationControlProps={{
      className: "justify-content-center mb-5",
    }}
    render={(products, paginationControl) => (
      <>
        <Row>
          {products.length > 0 ? (
            products.map((product) => (
              <Product
                subscriber={subscriber}
                product={product}
                key={product.id}
                additionalContent={
                  product.orderableOnline ? (
                    <QuantitySelect
                      order={(quantity) => makeOrder(product, quantity)}
                    />
                  ) : (
                    <span className="text-muted">Non commandable en ligne</span>
                  )
                }
              />
            ))
          ) : (
            <Card>
              <Card.Body className={"text-center"}>
                <p className={"lead"}>Aucun produit</p>
              </Card.Body>
            </Card>
          )}
        </Row>
        {paginationControl}
        {products.length === 0 && (
          <Instructions
            title={"Magasin"}
            emoji={"🛍️"}
            emojiAriaLabel="Des sacs de shopping"
          >
            Le magasin est vide pour l'instant.
            {association.myRole.permissions?.includes("media") // No link for now because there is no production addition page, TODO: create it
              ? "Ajoutez des produits dans les pages d'administration"
              : "Revenez quand les responsables de l'association l'auront garni !"}
          </Instructions>
        )}
      </>
    )}
  />
);
