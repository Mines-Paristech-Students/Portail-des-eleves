import React, { useContext } from "react";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import { QuantitySelect } from "./QuantitySelect";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { UserContext } from "../../../services/authService";
import { Pagination } from "../../utils/Pagination";
import { Product } from "./common/Product";

export const AssociationMarketplaceHome = ({ association }) => {
    const marketplaceId = association.id;

    const newToast = useContext(ToastContext);
    const user = useContext(UserContext);

    let makeOrder = (product, quantity) => {
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
            <div className={"float-right"}>
                <a
                    href={
                        "/associations/" +
                        marketplaceId +
                        "/marketplace/history/"
                    }
                    className={"btn btn-primary"}
                >
                    <i className={"fe fe-book-open"} /> Historique
                </a>
            </div>
            <PageTitle>Magasin</PageTitle>

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
            </Row>
        </Container>
    );
};
