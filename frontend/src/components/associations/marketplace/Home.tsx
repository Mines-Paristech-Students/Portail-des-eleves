import React, { useContext } from "react";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { QuantitySelect } from "./QuantitySelect";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { UserContext } from "../../../services/authService";
import { Pagination } from "../../utils/Pagination";
import { decidePlural } from "../../../utils/format";

export const AssociationMarketplaceHome = ({ association }) => {
    const marketplaceId = association.id;

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
                        { page_size: 5 },
                    ]}
                    apiMethod={api.products.list}
                    render={(products, controlbar) => (
                        <>
                            {products.map((product) => (
                                <AssociationMarketplaceProduct
                                    product={product}
                                    key={product.id}
                                />
                            ))}
                            {controlbar}
                        </>
                    )}
                />
            </Row>
        </Container>
    );
};

const AssociationMarketplaceProduct = ({ product }) => {
    const newToast = useContext(ToastContext);
    const user = useContext(UserContext);

    let makeOrder = (quantity) => {
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
        <Card>
            <Card.Body>
                <div className="float-right">
                    <QuantitySelect order={makeOrder} />
                </div>
                <Card.Title className="card-title">
                    {product.name}{" "}
                    <span className={"text-muted"}>
                        {product.price} € (
                        {product.numberLeft > -1
                            ? product.numberLeft +
                              " " +
                              decidePlural(
                                  product.numberLeft,
                                  "restant",
                                  "restants"
                              )
                            : ""}
                        )
                    </span>
                </Card.Title>
                <div className="card-subtitle">{product.description}</div>
            </Card.Body>
        </Card>
    );
};
