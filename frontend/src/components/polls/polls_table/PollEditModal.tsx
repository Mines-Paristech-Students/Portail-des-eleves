import React from 'react';
import {Poll} from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {PollEditModalAdminBody} from "./PollEditModalAdminBody";
import {PollEditModalUserBody} from "./PollEditModalUserBody";

type Props = {
    show: boolean,
    onHide: any,
    poll: Poll,
    setPoll: (poll: Poll) => void,
    adminVersion: boolean,
};

export function PollEditModal(props: Props) {
    function handleClose() {
        return props.onHide();
    }

    function handleSubmit() {

    }

    function renderBody() {
        if (props.adminVersion) {
            return <PollEditModalAdminBody poll={props.poll}
                                           setPoll={props.setPoll}/>
        } else {
            return <PollEditModalUserBody poll={props.poll}
                                          setPoll={props.setPoll}/>
        }
    }

    return (
        <Modal size="lg"
               show={props.show}
               onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Modifier</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {renderBody()}
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-icon"
                            variant="outline-danger"
                            onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button className="btn-icon"
                            variant="outline-success"
                            type="submit">
                        Valider
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
