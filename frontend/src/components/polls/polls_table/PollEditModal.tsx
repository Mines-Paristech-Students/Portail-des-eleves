import React from "react";
import { Poll } from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import { PollEditModalAdminForm } from "./PollEditModalAdminForm";
import { PollEditModalUserForm } from "./PollEditModalUserForm";

export const PollEditModal = ({ show, onHide, poll, refetch, isAdmin }: {
    show: boolean,
    onHide: any,
    poll: Poll,
    refetch: any,
    isAdmin: boolean,
}) => <Modal size="lg" show={show} onHide={onHide}>
    <Modal.Header>
        <Modal.Title>Modifier</Modal.Title>
    </Modal.Header>

    {isAdmin ? (
        <PollEditModalAdminForm
            poll={poll}
            handleClose={onHide}
            refetch={refetch}
        />
    ) : (
        <PollEditModalUserForm
            poll={poll}
            handleClose={onHide}
            refetch={refetch}
        />
    )}
</Modal>;