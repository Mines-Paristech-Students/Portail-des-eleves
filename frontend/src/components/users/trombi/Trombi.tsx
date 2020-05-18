import React from "react";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import { UserAvatarCard } from "../../utils/avatar/UserAvatarCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import { Link } from "react-router-dom";

export const Trombi = () => {
    return (
        <Container className="mt-5">
            <Row>
                <Col lg={3}></Col>
                <Col lg={9}>
                    <PageTitle>Trombinoscope</PageTitle>

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
                </Col>
            </Row>
        </Container>
    );
};
