import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { Association } from "../../../../models/associations/association";
import { Role } from "../../../../models/associations/role";

export const ConfirmAdministratorRemovalModal = ({
  association,
  role,
  onRemove,
  show,
  onHide,
}: {
  association: Association;
  role?: Role;
  onRemove: any;
  show: boolean;
  onHide: () => void;
}) => {
  const [confirmInput, setConfirmInput] = useState("");

  if (role === undefined) {
    return <></>;
  }

  const confirmTarget = role.user.id;
  const verifyConfirm = () =>
    confirmInput.toLowerCase() === confirmTarget.toLowerCase();

  return (
    <Modal
      show={show}
      onHide={() => {
        setConfirmInput("");
        onHide();
      }}
    >
      <Modal.Header>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Vous êtes sur le point d’enlever{" "}
          <span className="font-weight-bold">
            {role.user.firstName} {role.user.lastName}
          </span>{" "}
          du groupe des administrateur(trice)s de l’association{" "}
          {association.name}.
        </p>
        <p>
          <span className="font-weight-bold text-danger">
            Cette opération ne peut pas être annulée.
          </span>
        </p>
        <p>
          Veuillez taper{" "}
          <span className="font-weight-bold">{confirmTarget}</span> pour
          confirmer la suppression.
        </p>
        <Form.Control
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="danger"
          disabled={!verifyConfirm()}
          onClick={() => {
            if (verifyConfirm()) {
              setConfirmInput("");
              onRemove();
            }
          }}
        >
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
