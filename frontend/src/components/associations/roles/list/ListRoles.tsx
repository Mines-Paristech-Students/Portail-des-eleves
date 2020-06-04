import React from "react";
import { api } from "../../../../services/apiService";
import Container from "react-bootstrap/Container";
import { Pagination } from "../../../utils/Pagination";
import { Association } from "../../../../models/associations/association";
import { RolesListApiParameters } from "../../../../services/api/roles";
import Col from "react-bootstrap/Col";
import { UserAvatarCard } from "../../../utils/avatar/UserAvatarCard";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import { PageTitle } from "../../../utils/PageTitle";
import Card from "react-bootstrap/Card";

export const ListRoles = ({
    association,
    title,
    apiParameters,
}: {
    association: Association;
    title: string;
    apiParameters?: RolesListApiParameters;
}) => (
    <Pagination
        apiKey={[
            "roles.list",
            {
                association: association.id,
                ...apiParameters,
            },
        ]}
        apiMethod={api.roles.list}
        render={(roles, paginationControl) => (
            <Container className="mt-4">
                <PageTitle>{title}</PageTitle>

                <Row>
                    {roles.length > 0 ? (
                        roles
                            // Order by decreasing alphabetical order.
                            .sort((roleA, roleB) => roleA.rank - roleB.rank)
                            .map((role) => (
                                <Col
                                    xs={6}
                                    lg={3}
                                    key={role.id}
                                    className="mb-5"
                                >
                                    <UserAvatarCard
                                        userId={role.user.id}
                                        className="h-100"
                                        link={true}
                                    >
                                        <p className="text-center text-truncate mt-3 mb-0 px-2">
                                            <Link
                                                className="text-reset"
                                                to={`/profils/${role.user.id}`}
                                            >
                                                {role.user.firstName}{" "}
                                                {role.user.lastName}
                                            </Link>
                                            <br />
                                            <span className="text-muted">
                                                {role.role}
                                            </span>
                                        </p>
                                    </UserAvatarCard>
                                </Col>
                            ))
                    ) : (
                        <Col className="text-center">
                            <Card className="py-4">
                                <span className="align-middle">
                                    Personne ici !{" "}
                                    <span
                                        role="img"
                                        aria-label="Visage avec un monocle"
                                    >
                                        🧐
                                    </span>
                                </span>
                            </Card>
                        </Col>
                    )}

                    {paginationControl}
                </Row>
            </Container>
        )}
        paginationControlProps={{
            className: "justify-content-center mt-5",
        }}
    />
);
