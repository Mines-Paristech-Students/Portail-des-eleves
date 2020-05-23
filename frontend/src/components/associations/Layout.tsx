import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AssociationSidebar } from "./Sidebar";
import Container from "react-bootstrap/Container";
import React from "react";
import { Association } from "../../models/associations/association";

export const AssociationLayout = ({
    association,
    additionnalSidebar = null,
    children = null,
}: {
    association: Association;
    additionnalSidebar?: any;
    children?: any;
}) => (
    <Container>
        <Row>
            <Col md={3}>
                <AssociationSidebar association={association} />
                {additionnalSidebar}
            </Col>
            <Col md={9}>{children}</Col>
        </Row>
    </Container>
);
