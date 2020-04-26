import React, { useContext } from "react";
import { PageTitle } from "../../../utils/common";
import Container from "react-bootstrap/Container";
import { api, useBetterQuery } from "../../../services/apiService";
import { LoadingAssociation } from "../Loading";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { QuantitySelect } from "./QuantitySelect";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { UserContext } from "../../../services/authService";
import { Marketplace } from "../../../models/associations/marketplace";

export const AssociationMarketplaceHome = ({ association }) => {
    const marketplaceId = association.id;
    const { data: marketplace, status, error } = useBetterQuery<Marketplace>(
        "marketplace.get", api.marketplace.get, [marketplaceId]
    );

    if (status === 'loading') return <LoadingAssociation />;
    else if (status === 'error') return `Something went wrong: ${error}`;
    else if (status === 'success' && marketplace) {
        return (
            <Container>
                <div className={"float-right"}>
                    <a href={"/associations/" + marketplaceId + "/marketplace/history/"} className={"btn btn-primary"}>
                        <i className={"fe fe-book-open"} /> Historique
                    </a>
                </div>
                <PageTitle>Magasin</PageTitle>

                <Row>
                    {marketplace.products.map(product => (
                        <AssociationMarketplaceProduct
                            product={product}
                            key={product.id}
                        />
                    ))}
                </Row>
            </Container>
        );
    }

    return null;
};

const AssociationMarketplaceProduct = ({ product }) => {
    const newToast = useContext(ToastContext);
    const user = useContext(UserContext);

    let makeOrder = quantity => {
        api.transactions
            .create(product, quantity, user)
            .then(_ => {
                newToast({
                    message: "La commande a bien été passée",
                    level: ToastLevel.Success
                });
            })
            .catch(err => {
                newToast({
                    message: "Erreur durant la commande : " + err,
                    level: ToastLevel.Error
                });
            });
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title className="card-title">{product.name}</Card.Title>
                <div className="card-subtitle">{product.description}</div>
                <div className="mt-5 d-flex align-items-center">
                    <div className="product-price">
                        <strong>{product.price}€</strong>
                    </div>
                    <div className="ml-auto">
                        <QuantitySelect order={makeOrder} />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};
