import {PageTitle} from "../../../utils/common";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Button, Col, Modal} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import {electionActiveStatus, api, useBetterQuery} from "../../../services/apiService";
import {LoadingAssociation} from "../Loading";
import {Election, Ballot, Choice} from "../../../models/associations/election";
import {ChoiceButton, ListOfVotersButtonModal, toFrenchDate, toFrenchTimeNoSecondString} from "./Commons";
import {Formik, useField} from "formik";

export const AssociationElectionActiveList = ({ association }) => {

    const associationId = association.id;
    const { data, status, error } = useBetterQuery<Election[]>(
        "elections.list",
        api.elections.list,
        associationId,
        electionActiveStatus.Active
    );

    if (status === "loading") return <LoadingAssociation />;
    else if (status === "error") return `Something went wrong: ${error}`;
    else if (data) {
        return (
            <>
                <PageTitle className={"mt-6"}>Élections en cours</PageTitle>
                <Row>
                    {data.map(election => {
                        return (
                            <Col md={5} key={election.id}>
                                <ElectionCard election={election} association={association}/>
                            </Col>
                        );
                    })}
                </Row>
            </>
        )
    }
};

const ElectionCard = ({ election, association }) => {
    let editButton;
    if (association.myRole.electionPermission) {
        editButton = (
            <Link
                to={`/associations/${association.id}/elections/${election.id}/modifier`}
                className={"float-right mt-0"}
            >
                <i className={"fe fe-edit"}/>
            </Link>
        );
    } else {
        editButton = (<></>)
    }
    const startsAt = new Date(election.startsAt);
    const endsAt = new Date(election.endsAt);
    return (
        <Card>
            <Card.Body className={'ml-2 mr-2'}>
                <Row>
                    <Col xs={0}>
                        <h4>{election.name}</h4>
                    </Col>
                    <Col>
                        {editButton}
                    </Col>
                </Row>
                <Row>
                    <p>
                        Ouverture le {toFrenchDate(startsAt)} à {toFrenchTimeNoSecondString(startsAt)}<br/>
                        Fermeture le {toFrenchDate(endsAt)} à {toFrenchTimeNoSecondString(endsAt)}
                    </p>
                </Row>
                <Row>
                    <Vote election={election} association={association}/>
                </Row>
                <Row>
                    <ListOfVotersButtonModal election={election}/>
                </Row>
            </Card.Body>
        </Card>
    )
};

const Vote = ({ election, association, ...props }) => {
    const isRegisterd = election.isRegistered; //to know if the current user is registered to this election
    const hasVoted = election.hasVoted; //to know if the current user hasVoted
    const disabled = hasVoted || !isRegisterd; //if the current user has voter or is not registered he can't click on the choices button as well as the vote button
    const maxChoicesPerBallot = parseInt(election.maxChoicesPerBallot);

    const [showVoteConfirmation, setShowVoteConfirmation] = useState<boolean>(false);

    const handleShowAlert = () => {
        setShowVoteConfirmation(true)
    };

    const handleVote = (selected) => {
        setShowVoteConfirmation(false);
        const vote: Ballot = {
            election: election.id,
            choices: selected,
        };
        api.elections
            .vote(vote)
            .then(res => window.location.reload())
            .catch(err => {
                alert(err.message);
                window.location.reload();
            });

    };

    const handleCloseAlert = () => {
        setShowVoteConfirmation(false)
    };

    return (
        <Formik
            initialValues={{selected: []}}
            onSubmit={handleShowAlert}
        >
            {formik => (<form onSubmit={formik.handleSubmit}>
                <ChoicesField
                    name='selected'
                    choices={election.choices}
                    maxChoicesPerBallot={maxChoicesPerBallot}
                    disabled={disabled}
                />
                <div className={'small'}>
                    {election.maxChoicesPerBallot} choix maximum
                </div>
                <VoteButton
                    hasVoted={hasVoted}
                    isRegistered={isRegisterd}
                    disabled={disabled || formik.values.selected.length === 0} //can't click on the vote button if vote is disabled or no choices are selected
                />
                <AlertVoteConfirmation
                    show={showVoteConfirmation}
                    selected={formik.values.selected}
                    election={election}
                    handleVote={() => handleVote(formik.values.selected)}
                    handleClose={() => handleCloseAlert()}
                />
                <div className={'small'}>
                    Les résultats seront publiés à la fermeture de l'élection
                </div>
            </form>)}
        </Formik>
    )
};
const ChoicesField = (props) => {
    const [field, meta, helpers] = useField<number[]>(props);

    const handleClick = (choice: Choice) => {

        const index = field.value.findIndex((e)=>e===choice.id);
        const newSelected: number[] = field.value.slice();
        if (index >= 0) {
            newSelected.splice(index, 1)
        } else {
            newSelected.push(choice.id)
        }
        if (newSelected.length > props.maxChoicesPerBallot) {
            newSelected.shift()
        }
        helpers.setValue(newSelected)
    };

    return (
        props.choices.map(choice => (
            <ChoiceButton
                selected={field.value.includes(choice.id)}
                onClick={() => handleClick(choice)}
                disabled={props.disabled}
                key={choice.id}
            >
                {choice.name}
            </ChoiceButton>
        ))
    )
};


const VoteButton = (props) => {
    if (props.hasVoted) {
        return (
            <Button
                className={"btn btn-success mt-5"}
                type={'submit'}
                block
                disabled
            >
                Vous avez déjà voté.
            </Button>
        )
    } else if (!props.isRegistered) {
        return (
            <Button
                className={"btn btn-success mt-5"}
                type={'submit'}
                block
                disabled
            >
                Vous n'êtes pas inscrit à ce scrutin
            </Button>
        )
    } else {
        return (
            <Button
                className={"btn btn-success mt-5"}
                type={'submit'}
                block
                disabled={props.disabled}
            >
                Voter
            </Button>
        )
    }
};


const AlertVoteConfirmation = (props) => {
    return(
        <Modal
            show={props.show}
        >
            <Modal.Header>
                <Modal.Title>Attention</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Les votes étant anonymes, il n'est pas possible de modifier son vote ou de le consulter après avoir voté.</p>
                <p>
                    Votre vote :
                    <ul>
                        {props.selected.map((idi) =>
                            <li key={idi}>
                                {props.election.choices.find((c => c.id===idi)).name}
                            </li>
                        )}
                    </ul>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.handleClose()}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={() => props.handleVote()}>
                    Confirmer
                </Button>
            </Modal.Footer>
        </Modal>
    )

};