import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { User } from "../../../models/user/user";
import { UserAvatar } from "../../utils/avatar/UserAvatar";
import { Size } from "../../../utils/size";
import Button from "react-bootstrap/Button";
import { formatLongDate } from "../../../utils/format";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ACADEMIC_YEAR = new Map([
    ["1A", "1A"],
    ["2A", "2A"],
    ["GAP YEAR", "Césure"],
    ["3A", "3A"],
    ["GRADUATE", "Alumni"]
]);

export const UserProfileInfo = ({
    user,
    showEditButton = false,
}: {
    user: User;
    showEditButton?: boolean;
}) => (
    <Card>
        <Card.Body>
            <Row>
                <div className="media">
                    <UserAvatar
                        userId={user.id}
                        size={Size.XXL}
                        className="ml-3 mr-5"
                        link={false}
                    />
                    <div className="media-body">
                        <h3 className="m-0">{`${user.firstName} ${user.lastName}`}</h3>
                        <p className="font-italic mb-2">{user.nickname}</p>
                        <p className="text-muted">{`P${user.promotion} ${user.studentType} (${ACADEMIC_YEAR.get(user.currentAcademicYear)})`}</p>
                    </div>
                </div>
            </Row>
            <Row>
                <Col>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <span className="icon mr-3">
                                <i className="fe fe-calendar"></i>
                            </span>
                            {formatLongDate(user.birthday)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <span className="icon mr-3">
                                <i className="fe fe-mail"></i>
                            </span>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                        </ListGroup.Item>
                        {user.phone && (
                            <ListGroup.Item>
                                <span className="icon mr-3">
                                    <i className="fe fe-phone"></i>
                                </span>
                                {user.phone}
                            </ListGroup.Item>
                        )}
                        {user.room && (
                            <ListGroup.Item>
                                <OverlayTrigger
                                    placement={"bottom"}
                                    overlay={
                                        <Tooltip id={`tooltip-room-icon`}>
                                            Chambre à la Meuh
                                        </Tooltip>
                                    }
                                >
                                    <span className="icon mr-3">
                                        <i className="fe fe-home"></i>
                                    </span>
                                </OverlayTrigger>

                                {user.room}
                            </ListGroup.Item>
                        )}
                        {user.address && (
                            <ListGroup.Item>
                                <OverlayTrigger
                                    placement={"bottom"}
                                    overlay={
                                        <Tooltip id={`tooltip-address-icon`}>
                                            Adresse
                                        </Tooltip>
                                    }
                                >
                                    <span className="icon mr-3">
                                        <i className="fe fe-home"></i>
                                    </span>
                                </OverlayTrigger>
                                {user.address}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            </Row>
        </Card.Body>
        {showEditButton && (
            <Card.Footer>
                <Button href="profil/modifier" variant="outline-primary">
                    Modifier mon profil
                </Button>
            </Card.Footer>
        )}
    </Card>
);
