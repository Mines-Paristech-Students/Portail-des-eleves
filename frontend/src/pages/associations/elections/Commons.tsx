import React, {useContext, useState} from "react";
import {Button, Modal} from "react-bootstrap";


export const ChoiceButton = (props) => {
    return(
        <Button
            variant={props.selected ? 'dark' : 'outline-dark'}
            onClick={() => props.onClick()}
            block
            disabled={props.disabled}
        >
            {props.children}
        </Button>
    )
};

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