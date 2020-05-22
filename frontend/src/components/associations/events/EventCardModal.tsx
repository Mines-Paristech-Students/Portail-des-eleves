import React from "react";
import Modal from "react-bootstrap/Modal";

import { Event } from "../../../models/associations/event";
import { Table } from "../../utils/table/Table";

const columns = [
    {
        key: "firstName",
        header: "Prénom",
    },
    {
        key: "lastName",
        header: "Nom",
    },
    {
        key: "promotion",
        header: "Promotion",
    },
];

export const EventCardModal = ({
    event,
    show,
    handleClose,
}: {
    event: Event;
    show: boolean;
    handleClose: () => void;
}) => (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{event.name} — Inscriptions</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
            <Table
                columns={columns}
                data={event.participants}
                dataTable={false}
            />
        </Modal.Body>
    </Modal>
);
