import React, { useContext, useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import { QuantitySelect } from "./QuantitySelect";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { UserContext } from "../../../services/authService";
import { Pagination } from "../../utils/Pagination";
import { Product } from "./common/Product";
import { TagSearch } from "../../utils/tags/TagSearch";
import { AssociationLayout } from "../Layout";

export const AssociationMarketplaceHome = ({ association }) => {
    const marketplaceId = association.id;

    const newToast = useContext(ToastContext);
    const user = useContext(UserContext);

    const makeOrder = (product, quantity) => {
        api.transactions
            .create(product, quantity, user)
            .then((_) => {
                newToast({
                    message: "La commande a bien été passée",
                    level: ToastLevel.Success,
                });
            })
            .catch((err) => {
                newToast({
                    message: "Erreur durant la commande : " + err,
                    level: ToastLevel.Error,
                });
            });
    };

    const [tagParams, setTagParams] = useState({});
    return (
        <AssociationLayout
            association={association}
            additionalSidebar={
                <TagSearch
                    tagsQueryParams={{
                        page_size: 1000,
                        namespace__scoped_to_model: "association",
                        namespace__scoped_to_pk: marketplaceId,
                        related_to: "product",
                    }}
                    setTagParams={setTagParams}
                />
            }
        >
            <Container>
                <div className={"float-right"}>
                    <a
                        href={
                            "/associations/" +
                            marketplaceId +
                            "/magasin/historique/"
                        }
                        className={"btn btn-primary"}
                    >
                        <i className={"fe fe-book-open"} /> Historique
                    </a>
                </div>
                <PageTitle>Magasin</PageTitle>

                <Row>
                    <ProductsPagination
                        marketplaceId={marketplaceId}
                        tagParams={tagParams}
                        makeOrder={makeOrder}
                    />
                </Row>
            </Container>
        </AssociationLayout>
    );
};

const ProductsPagination = ({ marketplaceId, tagParams, makeOrder }) => (
    <Pagination
        apiKey={[
            "associations.list",
            marketplaceId,
            { ...tagParams, page_size: 8 },
        ]}
        apiMethod={api.products.list}
        render={(products, controlbar) => (
            <>
                <Row>
                    {products.map((product) => (
                        <Product
                            product={product}
                            key={product.id}
                            additionalContent={
                                <QuantitySelect
                                    order={(quantity) =>
                                        makeOrder(product, quantity)
                                    }
                                />
                            }
                        />
                    ))}
                </Row>
                {controlbar}
            </>
        )}
    />
);
