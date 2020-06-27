import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { NewRepartition } from "./NewRepartition";

const titles = ["titre A", "titre B"];

function titlecards() {
  return (
    <Container className="mt-5">
      {titles.map((title) => (
        <Card className="text-left">
          <Card.Title>{title}</Card.Title>
        </Card>
      ))}
    </Container>
  );
}

export const Groups = () => {
  return <NewRepartition>{titlecards()}</NewRepartition>;
};
