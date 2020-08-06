import React, { useState } from "react";
import { Association } from "../../../models/associations/association";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export const ConfirmDeleteModal = ({
  association,
  onDelete,
  show,
  onHide,
}: {
  association: Association;
  onDelete: any;
  show: boolean;
  onHide: () => void;
}) => {
  const [confirmInput, setConfirmInput] = useState("");
  const confirmTarget = association.name;
  const verifyConfirm = () =>
    confirmInput.toLowerCase() === confirmTarget.toLowerCase();

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Vous êtes sur le point de supprimer l’association{" "}
          <span className="font-weight-bold">{association.name}</span>.
        </p>
        <p>
          Cela supprimera également tous les objets liés à cette association
          (fichiers, rôles, événements, marché, bibliothèque…).
          <br />
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
          onClick={() => verifyConfirm() && onDelete()}
        >
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
