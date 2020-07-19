import React from "react";
import { Association } from "../../../../models/associations/association";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { PageCard } from "../PageCard";
import { PageTitle } from "../../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export const AssociationListNews = ({
  association,
}: {
  association: Association;
}) => (
  <Pagination
    apiKey={[
      "pages.list",
      {
        association_id: association.id,
        ordering: "-last_update_date",
        page_type: "NEWS",
      },
    ]}
    apiMethod={api.pages.list}
    render={(pages, paginationControl) => (
      <Container>
        <PageTitle>Brèves</PageTitle>
        <Row>
          {pages.length > 0 ? (
            pages.map((page) => (
              <Col key={page.id} xs={12} md={{ span: 10, offset: 1 }}>
                <PageCard association={association} page={page} header date />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <Card>
                <Card.Body>
                  Pas de brève pour le moment !{" "}
                  {association.myRole?.permissions?.includes("page") && (
                    <Link to="pages/creer">Ajouter une page.</Link>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {paginationControl}
      </Container>
    )}
  />
);
