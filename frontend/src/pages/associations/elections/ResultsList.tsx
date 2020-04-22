import {PageTitle} from "../../../utils/common";
import React, {useContext, useState} from "react";
import {api, useBetterQuery, electionActiveStatus} from "../../../services/apiService";
import {LoadingAssociation} from "../Loading";
import Row from "react-bootstrap/Row";
import {Col, Table} from "react-bootstrap";
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
        electionActiveStatus.Past
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
        const numberOfVoters = parseInt(data.numberOfVoters);
        const isRegistered = parseInt(data.numberOfRegistered);

        const dataPieChartWithoutAbstention = election.choices.map(choice => (
            [choice.name, parseInt(data.result[choice.id])*100/numberOfVoters]
        ));

        //console.log('datapieChartnoAbst', dataPieChartWithoutAbstention);
        const dataPieChartWithAbstention = election.choices.map(choice => (
            [choice.name, parseInt(data.result[choice.id])*100/isRegistered]
        ));

        dataPieChartWithAbstention.push(
            ['Abstention', (isRegistered-numberOfVoters)*100/isRegistered]
        );
        //console.log('datapieChartAbst', dataPieChartWithAbstention);
        const dataBarChart = election.choices.map(choice => (
            [choice.name, parseInt(data.result[choice.id])]
        ));
        //console.log('databarChartAbst', dataBarChart);
        const startsAt = new Date(election.startsAt);
        const endsAt = new Date(election.endsAt);
        return (
            <Card>
                <Card.Body className={'ml-2 mr-2'}>
                    <Row>
                        <h4>{election.name}</h4>
                    </Row>
                    <Row>
                        <p>
                            Ouverture le {startsAt.toLocaleDateString()} à {startsAt.toLocaleTimeString()}<br/>
                            Fermeture le {endsAt.toLocaleDateString()} à {endsAt.toLocaleTimeString()}
                        </p>
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
                                <tbody key={choice.id}>
                                    <tr>
                                        <td>{choice.name}</td>
                                        <td>{data.result[choice.id]}</td>
                                        {election.maxChoicesPerBallot === 1 ?
                                            <>
                                                <td>{(parseInt(data.result[choice.id])*100/numberOfVoters).toFixed(1)}</td>
                                                <td>{(parseInt(data.result[choice.id])*100/isRegistered).toFixed(1)}</td>
                                            </>
                                            :<></>
                                        }
                                    </tr>
                                </tbody>
                            ))}
                            <tbody>
                                <tr>
                                    <td>Abstention</td>
                                    <td>{isRegistered-numberOfVoters}</td>
                                    {election.maxChoicesPerBallot === 1 ?
                                        <>
                                            <td></td>
                                            <td>{((isRegistered-numberOfVoters)*100/isRegistered).toFixed(1)}</td>
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
