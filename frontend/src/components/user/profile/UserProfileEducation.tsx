import React from "react";
import Card from "react-bootstrap/Card";
import { CardStatus } from "../../utils/CardStatus";
import { User } from "../../../models/user";
import { Timeline } from "../../utils/timeline/Timeline";
import { TablerColor } from "../../../utils/colors";

export const UserProfileEducation = ({ user }: { user: User }) => (
    <Card>
        <CardStatus color={TablerColor.Red} position="left" />
        <Card.Header>
            <Card.Title>Scolarité</Card.Title>
        </Card.Header>
        <Card.Body className="px-7">
            <Timeline
                items={[
                    {
                        badgeColor: TablerColor.Gray,
                        content: "Arrivée aux Mines",
                        startDate: new Date(2017, 6),
                    },
                    {
                        badgeColor: TablerColor.Red,
                        content: "Stage chez IFPEN",
                        startDate: new Date(2018, 8),
                        endDate: new Date(2019, 1),
                    },
                    {
                        badgeColor: TablerColor.Red,
                        content: "Stage chez Adenergy",
                        startDate: new Date(2019, 6),
                        endDate: new Date(2020, 0),
                    },
                    {
                        badgeColor: TablerColor.Red,
                        content: "Stage chez Lombard Odier",
                        startDate: new Date(2020, 1),
                        endDate: new Date(2020, 8),
                    },
                    {
                        badgeColor: TablerColor.Gray,
                        content: "Départ des Mines",
                        startDate: new Date(2021, 7),
                    },
                ]}
            />
        </Card.Body>
    </Card>
);
