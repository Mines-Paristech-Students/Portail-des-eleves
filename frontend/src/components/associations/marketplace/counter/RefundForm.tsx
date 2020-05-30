import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import * as Yup from "yup";
import { Button, Col, Form as FormBoostrap, Row } from "react-bootstrap";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";

export const RefundForm = ({ customer, marketplaceId }) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    const [createFunding] = useMutation(api.fundings.create, {
        onSuccess: () => {
            sendSuccessToast(`Solde mis à jour`);
            queryCache.refetchQueries("marketplace.balance");
        },
        onError: (err) => {
            sendErrorToast(`Erreur lors du passage de la commande : ${err}`);
        },
    });

    const increaseBalance = ({ refund }) => {
        createFunding({
            marketplaceId,
            customerId: customer.id,
            value: refund,
        });
    };

    return (
        <Formik
            initialValues={{ refund: "" }}
            validationSchema={Yup.object().shape({
                refund: Yup.number()
                    .required("Veuillez entrer un nombre")
                    .moreThan(
                        0,
                        "Un solde doit être recrédité d'un nombre positif"
                    ),
            })}
            onSubmit={increaseBalance}
        >
            <Form>
                <FormBoostrap.Group>
                    <Row>
                        <Col>
                            <TextFormGroup
                                name="refund"
                                type="number"
                                placeholder="recréditer le compte"
                                textRight={"€"}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant={"success"}
                                type={"submit"}
                                className={"m-2"}
                            >
                                <span className="fe fe-plus " />
                                Créditer
                            </Button>
                        </Col>
                    </Row>
                </FormBoostrap.Group>
            </Form>
        </Formik>
    );
};
