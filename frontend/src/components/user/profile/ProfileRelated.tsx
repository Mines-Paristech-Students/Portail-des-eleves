import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UserAvatar } from "../../utils/avatar/UserAvatar";
import { AvatarList } from "../../utils/avatar/AvatarList";
import { decidePlural } from "../../../utils/format";
import {Profile} from "../../../models/profile";

const mapToUserAvatar = (userList) =>
    userList.map((user) => (
        <UserAvatar
            key={user.id}
            userId={user.id}
            tooltip={`${user.firstName} ${user.lastName}`}
        />
    ));

export const ProfileRelated = ({ profile }: { profile: Profile }) => (
    <Card>
        <Card.Body className="px-7">
            {profile.roommate.length > 0 && (
                <>
                    <Row className="mb-1">
                        <Col md="12">
                            <h5 className="font-weight-normal">
                                {decidePlural(
                                    profile.roommate.length,
                                    "Co",
                                    "Cos"
                                )}
                            </h5>
                        </Col>
                    </Row>
                    <Row className="justify-content-left mb-5">
                        <Col md="12">
                            <AvatarList>
                                {mapToUserAvatar(profile.roommate)}
                            </AvatarList>
                        </Col>
                    </Row>
                </>
            )}

            {(profile.minesparent.length > 0 || profile.fillots.length > 0) && (
                <>
                    <Row className="mb-1">
                        {profile.minesparent.length > 0 && (
                            <Col md="6">
                                <h5 className="font-weight-normal">
                                    {decidePlural(
                                        profile.minesparent.length,
                                        "Marrain(e)",
                                        "Marrain(e)s"
                                    )}
                                </h5>
                            </Col>
                        )}
                        {profile.fillots.length > 0 && (
                            <Col md="6">
                                <h5 className="font-weight-normal">
                                    {decidePlural(
                                        profile.fillots.length,
                                        "Fillot(e)",
                                        "Fillot(e)s"
                                    )}
                                </h5>
                            </Col>
                        )}
                    </Row>

                    <Row className="justify-content-left">
                        {profile.minesparent.length > 0 && (
                            <Col md="6" className="justify-content-left">
                                <AvatarList>
                                    {mapToUserAvatar(profile.minesparent)}
                                </AvatarList>
                            </Col>
                        )}

                        {profile.fillots.length > 0 && (
                            <Col md="6" className="justify-content-left">
                                <AvatarList>
                                    {mapToUserAvatar(profile.fillots)}
                                </AvatarList>
                            </Col>
                        )}
                    </Row>
                </>
            )}
        </Card.Body>
    </Card>
);
