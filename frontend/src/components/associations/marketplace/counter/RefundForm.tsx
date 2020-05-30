import React, { useContext, useState } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import * as Yup from "yup";
import {
    Button,
    Col,
    Form as FormBoostrap,
    Row,
    Modal,
    Card,
} from "react-bootstrap";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";

export const RefundForm = ({ customer, marketplaceId, ...props }) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [createFunding] = useMutation(api.fundings.create, {
        onSuccess: async () => {
            sendSuccessToast(`Solde mis à jour`);
            setShow(false);
            await queryCache.refetchQueries("marketplace.balance");
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
        <>
            <Button variant="outline-success" onClick={handleShow} {...props}>
                Recréditer le compte
            </Button>
            <Modal show={show} onHide={handleClose} centered={true}>
                <Card className={"m-0"}>
                    <Card.Body>
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
                            render={({ setFieldValue }) => (
                                <Form>
                                    <FormBoostrap.Group className={"m-0"}>
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

                                    <div className="d-flex justify-content-around">
                                        {[5, 10, 20, 50].map((val) => (
                                            <Button
                                                key={val}
                                                size={"lg"}
                                                variant={"outline-secondary"}
                                                onClick={() =>
                                                    setFieldValue("refund", val)
                                                }
                                            >
                                                {val}€
                                            </Button>
                                        ))}
                                    </div>
                                </Form>
                            )}
                        />
                    </Card.Body>
                </Card>
            </Modal>
        </>
    );
};
