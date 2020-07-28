import React from "react";
import { PageTitle } from "../utils/PageTitle";
import { api } from "../../services/apiService";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Pagination } from "../utils/Pagination";
import { Logo } from "./Logo";

export const AssociationList = () => (
  <Container className="mt-5">
    <PageTitle>Associations</PageTitle>
    <Pagination
      apiKey={["associations.list"]}
      apiMethod={api.associations.list}
      render={(associations, paginationControl) => (
        <div className={"card-columns"}>
          {associations.map((association) => (
            <Card key={association.id}>
              <Link to={`/associations/${association.id}`}>
                {association.logo && (
                  <Logo
                    association={association}
                    style={{ maxHeight: "500px" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{association.name}</Card.Title>
                </Card.Body>
              </Link>
            </Card>
          ))}
          {paginationControl}
        </div>
      )}
    />
  </Container>
);
