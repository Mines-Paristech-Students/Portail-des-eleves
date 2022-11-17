import React from "react";
import { PageTitle } from "../../utils/PageTitle";
import { api } from "../../../services/apiService";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Pagination } from "../../utils/Pagination";

export const FormList = () => (
  <Container>
    <PageTitle>Liste des formulaires</PageTitle>
    <Pagination
      apiKey={["api.courses.forms.list"]}
      apiMethod={api.courses.forms.list}
      render={(forms, paginationControl) => (
        <>
          <Row>
            {forms.map((form) => (
              <Card key={form.id} className={"col-md-3 m-4"}>
                <Card.Header as={Row}>
                  <Col sm={9}>
                    <Card.Title>{form.name}</Card.Title>
                  </Col>

                  <Col sm={2}>
                    <Button
                      /*
                      // @ts-ignore-warning */
                      as={Link}
                      variant="outline-primary"
                      to={`/cours/formulaires/${form.id}/editer`}
                    >
                      <i className="fe fe-edit" />
                    </Button>
                  </Col>
                </Card.Header>
              </Card>
            ))}
          </Row>
          {paginationControl}
        </>
      )}
    />
  </Container>
);
