import {PageTitle} from "../../../utils/common";
import React from "react";
import {Link} from "react-router-dom";
import {Col} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import {electionActiveStatus, api, useBetterQuery} from "../../../services/apiService";
import {LoadingAssociation} from "../Loading";
import {Election} from "../../../models/associations/election";
import {ChoiceButton, ListOfVotersButtonModal} from "./Commons";

export const AssociationElectionUpcomingList = ({ association }) => {

    const associationId = association.id;
    const { data, status, error } = useBetterQuery<Election[]>(
        "elections.list",
        api.elections.list,
        associationId,
        electionActiveStatus.Upcoming
    );

    if (status === "loading") return <LoadingAssociation />;
    else if (status === "error") return `Something went wrong: ${error}`;
    else if (data) {
        return (
            <>
                <PageTitle className={"mt-6"}>Élections à venir</PageTitle>
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
    const startsAt = new Date(election.startsAt);
    const endsAt = new Date(election.endsAt);
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
                        Ouverture le {startsAt.toLocaleDateString()} à {startsAt.toLocaleTimeString()}<br/>
                        Fermeture le {endsAt.toLocaleDateString()} à {endsAt.toLocaleTimeString()}
                    </p>
                </Row>
                <Row>
                    {election.choices.map(choice => (
                        <ChoiceButton
                            selected={false}
                            onClick={() => null}
                            disabled={true}
                            key={choice.id}
                        >
                            {choice.name}
                        </ChoiceButton>
                    ))}
                    <div className={'small'}>
                        {election.maxChoicesPerBallot} choix maximum
                    </div>
                </Row>
                <Row>
                    <ListOfVotersButtonModal election={election}/>
                </Row>
            </Card.Body>
        </Card>
    );
};
