import React, { useState } from "react";
import { PageTitle } from "../../../utils/common";
import Container from "react-bootstrap/Container";
import { Button, Col, Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { LoadingAssociation } from "../Loading";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { Tag } from "../../../utils/Tag";

export const AssociationMarketplaceHome = ({ association }) => {
    const [showBasket, setShowBasket] = useState(false);
    const [basket, setBasket] = useState({});

    const associationId = association.id;
    const { data, isLoading, error } = useQuery(
        ["products.get", { associationId }],
        api.products.list
    );

    const handleClose = () => setShowBasket(false);
    const handleShow = () => setShowBasket(true);

    if (isLoading) return <LoadingAssociation />;
    if (error) return `Something went wrong: ${error.message}`;
    if (data) {
        return (
            <Container>
                <div className={"float-right"}>
                    <Button
                        variant={"success"}
                        className={"mr-3"}
                        onClick={handleShow}
                    >
                        <i className={"fe fe-shopping-cart"} /> Mon panier
                    </Button>

                    <a href="" className={"btn btn-primary"}>
                        <i className={"fe fe-book-open"} /> Historique
                    </a>
                </div>
                <PageTitle>Magasin</PageTitle>

                <Row>
                    {data.map(product => (
                    <AssociationMarketplaceProduct product={product} key={product.id} />
                ))}
                </Row>

                <Modal show={showBasket} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Mon panier</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>A venir</Modal.Body>
                </Modal>
            </Container>
        );
    }

    return null;
};

const AssociationMarketplaceProduct = ({product}) => {
    return <Card>
        <Card.Body>
            <Card.Title className="card-title">{product.name}</Card.Title>
            <div className="card-subtitle">
                {product.description}
            </div>
            <div className="mt-5 d-flex align-items-center">
                <div className="product-price">
                    <strong>{product.price}€</strong>
                </div>
                <div className="ml-auto">
                    <Button variant="primary"><i className="fe fe-plus"/>Ajouter au panier</Button>
                </div>
            </div>
        </Card.Body>
    </Card>;
};
