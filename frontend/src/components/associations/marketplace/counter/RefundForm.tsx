import React, { useContext, useState } from "react";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { Button, Col, Form, Row } from "react-bootstrap";

export const RefundForm = ({ customer, marketplaceId }) => {
    const newToast = useContext(ToastContext);

    const [createFunding] = useMutation(api.fundings.create, {
        onSuccess: () => {
            newToast({
                message: `Solde mis à jour`,
                level: ToastLevel.Success,
            });
            queryCache.refetchQueries("marketplace.balance");
            setRefundValue("");
        },
        onError: (err) => {
            newToast({
                message: `Erreur lors du passage de la commande : ${err}`,
                level: ToastLevel.Error,
            });
        },
    });

    const increaseBalance = () => {
        let value = parseFloat(refundValue);
        if (value <= 0) {
            newToast({
                message: `Vous devez créditer un compte d'un nombre positif`,
                level: ToastLevel.Error,
            });
            return;
        }

        createFunding({
            marketplaceId,
            customerId: customer.id,
            value: value,
        });
    };

    const [refundValue, setRefundValue] = useState("");

    return (
        <div className="form-group">
            <Row>
                <Col>
                    <div className="input-group">
                        <Form.Control
                            type="number"
                            placeholder="recréditer le compte"
                            value={refundValue}
                            onChange={(e) => setRefundValue(e.target.value)}
                        />
                        <span className="input-group-append">
                            <span className="input-group-text">€</span>
                        </span>
                    </div>
                </Col>
                <Col xs="auto">
                    <Button variant={"success"} onClick={increaseBalance}>
                        <span className="fe fe-plus " />
                        Créditer
                    </Button>
                </Col>
            </Row>
        </div>
    );
};
