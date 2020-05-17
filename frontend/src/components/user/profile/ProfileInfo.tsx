import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { Profile } from "../../../models/profile";
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

export const ProfileInfo = ({
    profile,
    showEditButton = false,
}: {
    profile: Profile;
    showEditButton?: boolean;
}) => (
    <Card>
        <Card.Body>
            <Row>
                <div className="media">
                    <UserAvatar
                        userId={profile.id}
                        size={Size.XXL}
                        className="ml-3 mr-5"
                        link={false}
                    />
                    <div className="media-body">
                        <h3 className="m-0">{`${profile.firstName} ${profile.lastName}`}</h3>
                        <p className="font-italic mb-2">{profile.nickname}</p>
                        <p className="text-muted">{`P${profile.promotion} ${profile.studentType} (${ACADEMIC_YEAR.get(profile.currentAcademicYear)})`}</p>
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
                            {formatLongDate(profile.birthday)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <span className="icon mr-3">
                                <i className="fe fe-mail"></i>
                            </span>
                            <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        </ListGroup.Item>
                        {profile.phone && (
                            <ListGroup.Item>
                                <span className="icon mr-3">
                                    <i className="fe fe-phone"></i>
                                </span>
                                {profile.phone}
                            </ListGroup.Item>
                        )}
                        {profile.room && (
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

                                {profile.room}
                            </ListGroup.Item>
                        )}
                        {profile.address && (
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
                                {profile.address}
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
