import {PageTitle} from "../../../utils/common";
import React from "react";
import {Link} from "react-router-dom";
import {Col} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import {activeStatus, api, useBetterQuery} from "../../../services/apiService";
import {LoadingAssociation} from "../Loading";
import {Election} from "../../../models/associations/election";
import {ListOfVotersButtonModal} from "./Commons";

export const AssociationElectionUpcomingList = ({ association }) => {

    const associationId = association.id;
    const { data, status, error } = useBetterQuery<Election[]>(
        "elections.list",
        api.elections.list,
        associationId,
        activeStatus.Upcoming
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
                to={`/associations/${association.id}/files/upload`}
                className={"float-right mt-0"}
            >
                <i className={"fe fe-edit"}/> Modifier
            </Link>
        );
    } else {
        editButton = (<></>)
    }
    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col xs={0}>
                        <h4>{election.name}</h4>
                    </Col>
                    <Col>
                        {editButton}
                    </Col>
                </Row>
                <Row>
                    <p>Cette élection se tiendra entre le {startsAt.toLocaleDateString()} à {startsAt.toLocaleTimeString()} et le {endsAt.toLocaleDateString()} à {endsAt.toLocaleTimeString()}</p>
                    <p>Chaque électeur pourra faire {election.maxChoicesPerBallot} choix parmi les suivants :</p>
                </Row>
                <Row>
                    <ul>
                        {election.choices.map(choice => (
                            <li key={choice.id}>
                                {choice.name}
                            </li>
                        ))}
                    </ul>
                </Row>
                <Row>
                    <ListOfVotersButtonModal election={election}/>
                </Row>
            </Card.Body>
        </Card>
    );
};
