import { Form, Formik } from "formik";
import * as Yup from "yup";
import { api } from "../../../services/apiService";
import { queryCache } from "react-query";
import {
  Card,
  Container,
  Form as ReactBootstrapForm,
  Row,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import { TagEdition } from "../../utils/tags/TagEdition";
import { SwitchCheckbox } from "../../utils/forms/SwitchCheckbox";
import Button from "react-bootstrap/Button";
import React, { useContext, useState } from "react";
import { ToastContext } from "../../utils/Toast";
import { useHistory } from "react-router-dom";
import { TagAdder } from "../../utils/tags/TagAdder";
import { Tag } from "../../../models/tag";

export const ProductForm: ({
  association: Association,
  product: Product,
}) => React.ReactElement = ({ association, product }) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const history = useHistory();

  const changeNumberLeftStatus = (numberLeft, setFieldValue) => {
    // If the the user tries to define the quantity left as being negative,
    // put it to -1, which is the value for "unlimited stocks"
    const newNumberLeft = (numberLeft || 1) > -1 ? -1 : 1;
    setFieldValue("numberLeft", newNumberLeft);
  };

  const [tagsToAdd, setTagsToAdd] = useState<Tag[]>([]);

  const onSubmit = (values) => {
    values.comment = values.comment || "";

    if (product.id) {
      submitUpdate(values);
    } else {
      submitCreate(values);
    }
  };

  const submitUpdate = (product) => {
    api.products
      .update(product)
      .then(() => {
        queryCache.invalidateQueries("products.list");
        sendSuccessToast("Modifications enregistrées");
      })
      .catch((err) => {
        sendErrorToast(`Erreur lors de l'enregistrement : ${err}`);
      });
  };

  const submitCreate = async (product) => {
    try {
      const response = await api.products.create(product);
      queryCache.invalidateQueries("products.list");

      // Bind the created object to all necessary tags and THEN mark it
      // as done
      try {
        await Promise.allSettled(
          tagsToAdd.map((tag) => api.tags.bind("product", response.id, tag.id))
        );
      } catch (err) {
        sendErrorToast(`Erreur lors de l'ajout d'un tag : ${err}`);
      }

      sendSuccessToast("Produit créé");
      history.push(
        `/associations/${association.id}/magasin/produits/${response.id}/modifier`
      );
    } catch (err) {
      sendErrorToast(`Erreur lors de l'enregistrement : ${err}`);
    }
  };

  return (
    <Formik
      initialValues={product}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Le produit doit avoir un nom")
          .min(3, "Un nom doit avoir au minimum 3 caractères"),
        price: Yup.number()
          .required("Veuillez indiquer le prix")
          .min(0.0, "Un prix est positif askip"),
        numberLeft: Yup.number()
          .required("Veuillez entrer une quantité")
          .min(0, "Un stock est positif askip"),
      })}
      onSubmit={onSubmit}
      render={({ setFieldValue, values }) => (
        <Card>
          <Card.Body>
            <Form>
              <ReactBootstrapForm.Row>
                <Col md={6}>
                  <TextFormGroup
                    label="Nom du produit"
                    name="name"
                    type="text"
                    iconLeft="tag"
                  />
                </Col>
                <Col md={6}>
                  <TextFormGroup
                    label="Prix"
                    name="price"
                    type="number"
                    step="0.01"
                    className={"text-right"}
                    textRight={"€"}
                  />
                </Col>
                <Col md={6}>
                  <TextFormGroup
                    label="Description"
                    name="description"
                    iconLeft="message-square"
                    as="textarea"
                  />
                </Col>
                <Col md={6}>
                  <TextFormGroup
                    label="Commentaire (privé)"
                    name="comment"
                    iconLeft="message-circle"
                    as="textarea"
                  />
                </Col>
                <Col md={6}>
                  <ReactBootstrapForm.Group>
                    <ReactBootstrapForm.Label>Tags</ReactBootstrapForm.Label>
                    {product.id ? (
                      <TagEdition id={product.id} model={"product"} />
                    ) : (
                      <TagAdder
                        placeholder={"Ajouter des tags"}
                        parent={"association"}
                        parentId={association.id}
                        onChange={setTagsToAdd}
                      />
                    )}
                  </ReactBootstrapForm.Group>
                </Col>
                <Col md={6}>
                  <>
                    <ReactBootstrapForm.Label>
                      Stock restant
                    </ReactBootstrapForm.Label>
                    <Row>
                      <label className={"col mt-3"}>
                        <input
                          type="checkbox"
                          name="custom-switch-checkbox"
                          className="custom-switch-input"
                          checked={values.numberLeft <= -1}
                          onChange={() =>
                            changeNumberLeftStatus(
                              values.numberLeft,
                              setFieldValue
                            )
                          }
                        />
                        <span className="custom-switch-indicator" />
                        <span className="custom-switch-description">
                          Stocks illimités
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
                <Col md={6}>
                  <ReactBootstrapForm.Label>Autres</ReactBootstrapForm.Label>
                  <Row>
                    <SwitchCheckbox name={"orderableOnline"}>
                      Commandable en ligne
                    </SwitchCheckbox>
                  </Row>
                </Col>
              </ReactBootstrapForm.Row>

              <Container className="text-right">
                <Button type="submit" variant="primary">
                  Envoyer
                </Button>
              </Container>
            </Form>
          </Card.Body>
        </Card>
      )}
    />
  );
};
