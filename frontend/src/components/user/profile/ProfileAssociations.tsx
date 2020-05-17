import React from "react";
import { CardStatus } from "../../utils/CardStatus";
import Card from "react-bootstrap/Card";
import { TablerColor } from "../../../utils/colors";
import { Timeline } from "../../utils/timeline/Timeline";
import { Profile } from "../../../models/profile";
import { TimelineItem } from "../../utils/timeline/TimelineItem";
import { Link } from "react-router-dom";

const NoContent = () => (
    <p className="text-center">
        Pas d’historique associatif{" "}
        <span role="img" aria-label="Visage souriant avec une goutte de sueur">
            😅
        </span>
    </p>
);

export const ProfileAssociations = ({ profile }: { profile: Profile }) => (
    <Card>
        <CardStatus color={TablerColor.Green} position="left" />
        <Card.Header>
            <Card.Title>Associations</Card.Title>
        </Card.Header>
        <Card.Body className="px-7">
            {profile.roles.length > 0 ? (
                <Timeline>
                    {profile.roles
                        .sort(
                            (roleA, roleB) =>
                                roleA.startDate.getTime() -
                                roleB.startDate.getTime()
                        )
                        .map((role) => (
                            <TimelineItem
                                key={role.id}
                                badgeColor={TablerColor.Green}
                                content={
                                    <span>
                                        <span className="font-weight-bold">
                                            <Link
                                                to={`/associations/${role.association.id}`}
                                                className="text-reset"
                                            >
                                                {role.association.name}
                                            </Link>
                                        </span>
                                        {" : "}
                                        {role.role}
                                    </span>
                                }
                                startDate={role.startDate}
                                endDate={role.endDate}
                            />
                        ))}
                </Timeline>
            ) : (
                <NoContent />
            )}
        </Card.Body>
    </Card>
);
