import React from 'react';
import {Poll} from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import {PollEditModalAdminForm} from "./PollEditModalAdminForm";
import {PollEditModalUserForm} from "./PollEditModalUserForm";

type Props = {
    show: boolean,
    onHide: any,
    poll: Poll,
    setPoll: (poll: Poll) => void,
    adminVersion: boolean,
};

export function PollEditModal(props: Props) {
    function handleClose(): void {
        props.onHide();
    }

    return (
        <Modal size="lg"
               show={props.show}
               onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Modifier</Modal.Title>
            </Modal.Header>

            {
                props.adminVersion
                    ? <PollEditModalAdminForm poll={props.poll}
                                              setPoll={props.setPoll}
                                              handleClose={handleClose}/>
                    : <PollEditModalUserForm poll={props.poll}
                                             setPoll={props.setPoll}
                                             handleClose={handleClose}/>
            }
        </Modal>
    );
}
