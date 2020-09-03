import { Card, Row, Col } from "react-bootstrap";
import { api } from "../../../services/apiService";
import React, { useContext, useState } from "react";
import { MutationFunction, queryCache, useMutation } from "react-query";
import { ToastContext } from "../../utils/Toast";
import { genericMutationErrorHandling } from "../../../utils/genericMutationErrorHandling";

/**
 * Component to allow the user choose opt-in settings, such as
 * whether or not the library and marketplace are enabled
 */
export const AssociationOptInSettings = ({ association }) => (
  <Card>
    <Card.Header>
      <Card.Title>Fonctionnalités</Card.Title>
    </Card.Header>
    <Card.Body>
      <Row>
        <Col xs={6}>
          <EnableModuleForm
            id={association.id}
            label={"Magasin"}
            apiMethod={api.marketplace.update}
            initialValue={association.enabledModules.includes("marketplace")}
          />
        </Col>
        <Col xs={6}>
          <EnableModuleForm
            id={association.id}
            label={"Bibliothèque"}
            apiMethod={api.library.update}
            initialValue={association.enabledModules.includes("library")}
          />
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

/**
 * Form to enable or disable marketplace and library
 *
 * @param id the id of the module (should be the same as the association)
 * @param label
 * @param apiMethod the method to update the model
 * @param initialValue
 */
const EnableModuleForm = ({
  id,
  label,
  apiMethod,
  initialValue,
}: {
  id: string;
  label: string;
  initialValue: boolean;
  apiMethod: MutationFunction<any, any>;
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const [checked, setIsChecked] = useState(initialValue);

  const [save] = useMutation(apiMethod, {
    onSuccess: (entity) => {
      setIsChecked(entity.enabled);
      sendSuccessToast("Association modifiée.");
      return queryCache.invalidateQueries(["association.get", { id }]);
    },
    onError: genericMutationErrorHandling(sendErrorToast),
  });

  return (
    <label
      onClick={() => {
        save({ id: id, enabled: !checked });
      }}
    >
      <input
        type="checkbox"
        className="custom-switch-input"
        checked={checked}
      />
      <span className="custom-switch-indicator" />
      <span className="custom-switch-description">{label}</span>
    </label>
  );
};
