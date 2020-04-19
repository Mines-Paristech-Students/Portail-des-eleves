import {PageTitle} from "../../../utils/common";
import React, {useContext, useState} from "react";
import {api, useBetterQuery, activeStatus} from "../../../services/apiService";
import {LoadingAssociation} from "../Loading";
import Row from "react-bootstrap/Row";
import {Button, Col, Table} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {Election, Result,} from "../../../models/associations/election";
import { PieChart, BarChart } from 'react-chartkick';
import { ListOfVotersButtonModal } from './Commons'
import 'chart.js';
export const AssociationElectionResultsList = ({ association }) => {
    const associationId = association.id;
    const { data, status, error } = useBetterQuery<Election[]>(
        "elections.list",
        api.elections.list,
        associationId,
        activeStatus.Past
    );

    if (status === "loading") return <LoadingAssociation />;
    else if (status === "error") return `Something went wrong: ${error}`;
    else if (data) {
        return (
            <>
                <PageTitle className={"mt-6"}>Résultats des élections passées</PageTitle>
                <Row>
                    {data.map((election) => {
                        return (
                            <Col md={6} key={election.id}>
                                <ElectionResultCard election={election}/>
                            </Col>
                        );
                    })}
                </Row>
            </>
        )
    }
};

const ElectionResultCard = ({ election }) => {
    const electionId=election.id;
    const { data, status, error } = useBetterQuery<Result>(
        `election.${election.id}.result`,
        api.elections.results,
        electionId
    );
    if (status === "loading") return <LoadingElectionCard election={election}/>;
    else if (status === "error") return <ErrorLoadingElectionCard error={error} election={election}/>;
    else if (data) {
        console.log(data);
        const nbVoters = parseInt(data.nbVoters);
        const nbRegisterd = parseInt(data.nbRegistered);

        const dataPieChartWithoutAbstention = election.choices.map(choice => (
            [choice.name, parseInt(data.result[choice.id])*100/nbVoters]
        ));
        const dataPieChartWithAbstention = election.choices.map(choice => (
            [choice.name, parseInt(data.result[choice.id])*100/nbRegisterd]
        ));
        dataPieChartWithAbstention.push(
            ['Abstention', (nbRegisterd-nbVoters)*100/nbRegisterd]
        );
        const dataBarChart = election.choices.map(choice => (
            [choice.name, parseInt(data.result[choice.id])]
        ));
        const startsAt = new Date(election.startsAt);
        const endsAt = new Date(election.endsAt);
        return (
            <Card>
                <Card.Body>
                    <Row>
                        <h4>{election.name}</h4>
                        <p>Cette élection s'est tenu entre le {startsAt.toLocaleDateString()} à {startsAt.toLocaleTimeString()} et le {endsAt.toLocaleDateString()} à {endsAt.toLocaleTimeString()}</p>
                        <p>Il était de possible de faire {election.maxChoicesPerBallot} choix parmi ceux proposés</p>
                    </Row>
                    <Row>
                        <Table striped bordered hover size={'sm'}>
                            <thead>
                                <tr>
                                    <th>Choix</th>
                                    <th>Nombre de vote(s)</th>
                                    {election.maxChoicesPerBallot === 1 ?
                                        <>
                                            <th>% sans abstention</th>
                                            <th>% avec abstention</th>
                                        </>
                                        :<></>
                                    }
                                </tr>
                            </thead>

                            {election.choices.map(choice => (
                                <tbody>
                                    <tr>
                                        <td>{choice.name}</td>
                                        <td>{data.result[choice.id]}</td>
                                        {election.maxChoicesPerBallot === 1 ?
                                            <>
                                                <td>{(parseInt(data.result[choice.id])*100/nbVoters).toFixed(1)}</td>
                                                <td>{(parseInt(data.result[choice.id])*100/nbRegisterd).toFixed(1)}</td>
                                            </>
                                            :<></>
                                        }
                                    </tr>
                                </tbody>
                            ))}
                            <tbody>
                                <tr>
                                    <td>Abstention</td>
                                    <td>{nbRegisterd-nbVoters}</td>
                                    {election.maxChoicesPerBallot === 1 ?
                                        <>
                                            <td></td>
                                            <td>{((nbRegisterd-nbVoters)*100/nbRegisterd).toFixed(1)}</td>
                                        </>
                                        :<></>
                                    }
                                    </tr>
                                </tbody>


                        </Table>
                    </Row>
                    <Row>
                        {election.maxChoicesPerBallot === 1 ?
                            <>
                                <Col md={6}>
                                    <h5 className={'text-center'}>Sans abstention</h5>
                                    <PieChart
                                        data={dataPieChartWithoutAbstention}
                                        donut={true}
                                        suffix={"%"}
                                        round={1}
                                        legend={false}
                                    />
                                </Col>
                                <Col md={6}>
                                    <h5 className={'text-center'}>Avec abstention</h5>
                                    <PieChart
                                        data={dataPieChartWithAbstention}
                                        donut={true}
                                        suffix={'%'}
                                        round={1}
                                        legend={false}
                                    />
                                </Col>
                            </>
                            : <>
                                <BarChart data={dataBarChart} legend={false}/>
                            </>
                        }
                    </Row>
                    <Row>
                        <ListOfVotersButtonModal election={election}/>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
    return null;
};

const LoadingElectionCard = ({ election }) => {
    return (
        <Card>
            <Card.Body>
                <h4>{election.name}</h4>
                <p>Chargement des résultats en cours...</p>
            </Card.Body>
        </Card>
    )
};

const ErrorLoadingElectionCard = ({ error, election }) => {
    return (
        <Card>
            <Card.Body>
                <h4>{election.name}</h4>
                <p>Something went wrong : {error}</p>
            </Card.Body>
        </Card>
    )
};
