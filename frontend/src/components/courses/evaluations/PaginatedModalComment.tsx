

import React, { useState, useEffect, useContext } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { api, useBetterQuery, PaginatedResponse } from "../../../services/apiService";
import { Card, Container, Row, Accordion, Col, Carousel, Button, Modal } from "react-bootstrap";
import { QuestionCategory, Question } from "../../../models/courses/question";
import { StatsQuestion, Comment } from "../../../models/courses/requests";
import { ColumnChart } from 'react-chartkick';
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { Pagination } from "../../utils/Pagination";
import 'chart.js';


export const PaginatedModalComment = ({ question, course }) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <Card.Text
            as={Button}
            onClick={() => setShow(true)}
            variant="light"
        >
            Détails <i className="fe fe-list" />

            <Modal
                show={show}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2>{question.label}</h2>
                    </Modal.Title>
                </Modal.Header>

                <Pagination
                    apiKey={["api.comments.list", course.id, question.id]}
                    apiMethod={api.courses.comments.list}
                    render={(comments: Comment[], paginationControl) => (
                        <Modal.Body className="overflow-auto">

                            <Col>
                                {comments.map(comment => (
                                    <Card as={Row} className="p-2 b-2 overflow-auto">
                                        <Card.Text>
                                            {comment.content}
                                        </Card.Text>
                                    </Card>
                                ))}
                            </Col>

                            {paginationControl}

                        </Modal.Body>
                    )}
                />
            </Modal>
        </Card.Text>
    )
}