import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { User } from "../../../models/user";
import { UserAvatar } from "../../utils/avatar/UserAvatar";
import { AvatarList } from "../../utils/avatar/AvatarList";
import { decidePlural } from "../../../utils/format";

const mapToUserAvatar = (userList) =>
    userList.map((user) => (
        <UserAvatar
            key={user.id}
            userId={user.id}
            tooltip={`${user.firstName} ${user.lastName}`}
        />
    ));

export const UserProfileRelated = ({ user }: { user: User }) => (
    <Card>
        <Card.Body className="px-7">
            {user.roommate.length > 0 && (
                <>
                    <Row className="mb-1">
                        <Col md="12">
                            <h5 className="font-weight-normal">
                                {decidePlural(
                                    user.roommate.length,
                                    "Co",
                                    "Cos"
                                )}
                            </h5>
                        </Col>
                    </Row>
                    <Row className="justify-content-left mb-5">
                        <Col md="12">
                            <AvatarList>
                                {mapToUserAvatar(user.roommate)}
                            </AvatarList>
                        </Col>
                    </Row>
                </>
            )}

            {(user.minesparent.length > 0 || user.fillots.length > 0) && (
                <>
                    <Row className="mb-1">
                        {user.minesparent.length > 0 && (
                            <Col md="6">
                                <h5 className="font-weight-normal">
                                    {decidePlural(
                                        user.minesparent.length,
                                        "Marrain(e)",
                                        "Marrain(e)s"
                                    )}
                                </h5>
                            </Col>
                        )}
                        {user.fillots.length > 0 && (
                            <Col md="6">
                                <h5 className="font-weight-normal">
                                    {decidePlural(
                                        user.fillots.length,
                                        "Fillot(e)",
                                        "Fillot(e)s"
                                    )}
                                </h5>
                            </Col>
                        )}
                    </Row>

                    <Row className="justify-content-left">
                        {user.minesparent.length > 0 && (
                            <Col md="6" className="justify-content-left">
                                <AvatarList>
                                    {mapToUserAvatar(user.minesparent)}
                                </AvatarList>
                            </Col>
                        )}

                        {user.fillots.length > 0 && (
                            <Col md="6" className="justify-content-left">
                                <AvatarList>
                                    {mapToUserAvatar(user.fillots)}
                                </AvatarList>
                            </Col>
                        )}
                    </Row>
                </>
            )}
        </Card.Body>
    </Card>
);
