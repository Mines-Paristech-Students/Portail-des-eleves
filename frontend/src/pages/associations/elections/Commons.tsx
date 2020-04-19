import {PageTitle} from "../../../utils/common";
import React, {useContext, useState} from "react";
import {Link} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import {activeStatus, api, useBetterQuery} from "../../../services/apiService";
import {LoadingAssociation} from "../Loading";
import {Election, Ballot, Choice} from "../../../models/associations/election";
import {ToastContext} from "../../../utils/Toast";

export const ListOfVotersButtonModal = ({election, ...props}) => {
    const [show, setShow] = useState<boolean>(false);
    const handleClose = () => setShow(false)
    return (
        <>
            <Button
                variant={'link'}
                onClick={() => setShow(true)}
            >
                Voir les personnes autorisées à voter
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Liste des personnes autorisées à voter au scrutin "{election.name}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {election.registeredVoters.map(voter => <li key={voter}>{voter}</li>)}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}