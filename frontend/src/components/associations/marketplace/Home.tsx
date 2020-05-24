import React, { useContext } from "react";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import { QuantitySelect } from "./QuantitySelect";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { UserContext } from "../../../services/authService";
import { Pagination } from "../../utils/Pagination";
import { Product } from "./Product";

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

    return (
        <Container>
            <div className="d-flex align-items-center">
                <PageTitle>Magasin</PageTitle>
                <div className={"ml-auto"}>
                    <a
                        href={
                            "/associations/" +
                            marketplaceId +
                            "/magasin/historique/"
                        }
                        className={"btn btn-primary btn-sm"}
                    >
                        <i className={"fe fe-book-open"} /> Historique
                    </a>
                </div>
            </div>

            <Row>
                <Pagination
                    apiKey={[
                        "associations.list",
                        marketplaceId,
                        { page_size: 8 },
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
                                            product.orderableOnline ? (
                                                <QuantitySelect
                                                    order={(quantity) =>
                                                        makeOrder(
                                                            product,
                                                            quantity
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <span className="text-muted">
                                                    Non commandable en ligne
                                                </span>
                                            )
                                        }
                                    />
                                ))}
                            </Row>
                            {controlbar}
                        </>
                    )}
                />
            </Row>
        </Container>
    );
};
