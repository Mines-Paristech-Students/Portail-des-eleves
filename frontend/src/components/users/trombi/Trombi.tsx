import React, { useState } from "react";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import { UserAvatarCard } from "../../utils/avatar/UserAvatarCard";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import { Link } from "react-router-dom";
import Select from "react-select";

export const Trombi = () => {
    const [inputValue, setInputValue] = useState("");
    const options = [
        {
            value: 17,
            label: "P17",
        },
        {
            value: 18,
            label: "P18",
        },
        {
            value: 19,
            label: "P19",
        },
    ];

    return (
        <Container className="mt-5">
            <PageTitle>Trombinoscope</PageTitle>

            <Row className="mb-3">
                <Col xs={12}>
                    <Card>
                        <Select options={options} isMulti placeholder="Filtrer par promotion…" />
                    </Card>
                </Col>
            </Row>

            <Pagination
                apiKey={["users.list"]}
                apiMethod={api.users.list}
                render={(users, paginationControl) => {
                    return (
                        <>
                            <Row>
                                {users
                                    // Order by decreasing alphabetical order.
                                    .sort((userA, userB) =>
                                        userB.id.localeCompare(userA.id)
                                    )
                                    .map((user) => (
                                        <Col
                                            lg={2}
                                            key={user.id}
                                            className="mb-5"
                                        >
                                            <UserAvatarCard
                                                userId={user.id}
                                                className="h-100"
                                            >
                                                <p className="text-muted text-center text-truncate mt-3 mb-0 px-2">
                                                    <Link
                                                        className="text-reset"
                                                        to={`/profils/${user.id}`}
                                                    >
                                                        {user.id}
                                                    </Link>
                                                </p>
                                            </UserAvatarCard>
                                        </Col>
                                    ))}
                            </Row>

                            {paginationControl}
                        </>
                    );
                }}
            />
        </Container>
    );
};
