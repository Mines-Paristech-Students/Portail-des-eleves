import React, { useState } from "react";
import { Table, useColumns } from "../../utils/table/Table";
import { Poll } from "../../../models/polls";
import { api } from "../../../services/apiService";
import { PollsLoading } from "../PollsLoading";
import { PollsError } from "../PollsError";
import { Pagination } from "../../utils/Pagination";
import { formatDate } from "../../../utils/format";
import { PollStateIcon } from "../polls_table/PollStateIcon";
import { PollEditModal } from "../polls_table/PollEditModal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import "./test.css";

export const Test = ({}: {}) => {
    return (
        <Container>
            <Row>
                <Col md="9">
                    <Card>
                        <Card.Body></Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
