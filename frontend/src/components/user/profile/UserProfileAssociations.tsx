import React from "react";
import { User } from "../../../models/user";
import { CardStatus } from "../../utils/CardStatus";
import Card from "react-bootstrap/Card";
import { TablerColor } from "../../../utils/colors";
import { Timeline } from "../../utils/timeline/Timeline";

const UserProfileAssociationsNoContent = () => (
    <>Pas d’historique associatif. :'(</>
);

export const UserProfileAssociations = ({ user }: { user: User }) => (
    <Card>
        <CardStatus color={TablerColor.Green} position="left" />
        <Card.Header>
            <Card.Title>Associations</Card.Title>
        </Card.Header>
        <Card.Body className="px-7">
            <Timeline
                items={[
                    {
                        badgeColor: TablerColor.Green,
                        content: (
                            <span>
                                <span className="font-weight-bold">JuMP</span>
                                {" : "}
                                Vice-trésorier
                            </span>
                        ),
                        startDate: new Date(2017, 11),
                        endDate: new Date(2019, 4),
                    },
                    {
                        badgeColor: TablerColor.Green,
                        content: (
                            <span>
                                <span className="font-weight-bold">
                                    Portail des élèves
                                </span>
                                {" : "}
                                Claqueur
                            </span>
                        ),
                        startDate: new Date(2019, 9),
                        endDate: new Date(2033, 4),
                    },
                ]}
            />
        </Card.Body>
    </Card>
);
