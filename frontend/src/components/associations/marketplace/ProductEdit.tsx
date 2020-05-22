import React, { useContext, useEffect, useState } from "react";
import { api, useBetterQuery } from "../../../services/apiService";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";
import { Product } from "../../../models/associations/marketplace";
import { Link, useParams, useHistory } from "react-router-dom";
import { PageTitle } from "../../utils/PageTitle";
import { TagEdition } from "../../utils/tags/TagEdition";
import { Container, Form as ReactBootstrapForm, Row } from "react-bootstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Col from "react-bootstrap/Col";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { queryCache } from "react-query";

export const AssociationMarketplaceProductEdit = ({ association }) => {
    const { productId } = useParams<{ productId: string }>();
    const newToast = useContext(ToastContext);
    const history = useHistory();

    const { data: product, status, error } = useBetterQuery<Product>(
        ["product.get", productId],
        api.products.get
    );

    const changeNumberLeftStatus = (numberLeft, setFieldValue) => {
        const newNumberLeft = (numberLeft || 1) > -1 ? -1 : 1;
        setFieldValue("numberLeft", newNumberLeft);
    };

    return status === "loading" ? (
        <Loading className="mt-5" />
    ) : error ? (
        <Error detail={error} />
    ) : product ? (
        <Container>
            <PageTitle>
                <a onClick={history.goBack} className={"text-primary"}>
                    <i className={"fe fe-arrow-left"} />
                </a>
                Editer le produit
            </PageTitle>
            <Formik
                initialValues={product}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required("Le produit doit avoir un nom")
                        .min(3, "Un nom doit avoir au minimum 3 caractères"),
                    price: Yup.number().min(0.0, "Un prix est positif askip"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    api.products
                        .update(values)
                        .then((res) => {
                            newToast({
                                message: "Modifications enregistrées",
                                level: ToastLevel.Success,
                            });
                            queryCache.refetchQueries("products.list")
                        })
                        .catch((err) => {
                            newToast({
                                message: `Erreur lors de l'enregistrement : ${err}`,
                                level: ToastLevel.Error,
                            });
                        });
                }}
                render={({ setFieldValue, values, errors }) => (
                    <Form>
                        <ReactBootstrapForm.Row className="mt-5">
                            <Col md={{ span: 6 }}>
                                <TextFormGroup
                                    label="Nom du produit"
                                    name="name"
                                    type="text"
                                    iconLeft="user"
                                />
                            </Col>
                            <Col md={{ span: 6 }}>
                                <TextFormGroup
                                    label="Prix"
                                    name="price"
                                    type="number"
                                    iconLeft="dollar-sign"
                                />
                            </Col>
                            <Col md={{ span: 6 }}>
                                <TextFormGroup
                                    label="Description"
                                    name="description"
                                    iconLeft="message-square"
                                    as="textarea"
                                />
                            </Col>
                            <Col md={{ span: 6 }}>
                                <TextFormGroup
                                    label="Commentaire (privé)"
                                    name="comment"
                                    iconLeft="message-circle"
                                    as="textarea"
                                />
                            </Col>
                            <Col md={{ span: 6 }}>
                                <ReactBootstrapForm.Group>
                                    <ReactBootstrapForm.Label>
                                        Tags
                                    </ReactBootstrapForm.Label>
                                    <TagEdition
                                        id={productId}
                                        model={"product"}
                                    />
                                </ReactBootstrapForm.Group>
                            </Col>
                            <Col md={{ span: 6 }}>
                                <>
                                    <ReactBootstrapForm.Label>
                                        Nombre restant
                                    </ReactBootstrapForm.Label>
                                    <Row>
                                        <label className={"col mt-3"}>
                                            <input
                                                type="checkbox"
                                                name="custom-switch-checkbox"
                                                className="custom-switch-input"
                                                checked={
                                                    values.numberLeft <= -1
                                                }
                                                onChange={() =>
                                                    changeNumberLeftStatus(
                                                        values.numberLeft,
                                                        setFieldValue
                                                    )
                                                }
                                            />
                                            <span className="custom-switch-indicator" />
                                            <span className="custom-switch-description">
                                                Stocks limités
                                            </span>
                                        </label>
                                        {values.numberLeft > -1 && (
                                            <Col>
                                                <TextFormGroup
                                                    label=""
                                                    name="numberLeft"
                                                    type="number"
                                                    textRight={"restants"}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </>
                            </Col>
                        </ReactBootstrapForm.Row>

                        <Container className="mb-5 text-right">
                            <Button type="submit" variant="primary">
                                Envoyer
                            </Button>
                        </Container>
                    </Form>
                )}
            />
        </Container>
    ) : null;
};
