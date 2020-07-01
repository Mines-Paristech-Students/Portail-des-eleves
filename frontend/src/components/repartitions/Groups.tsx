import React, { ReactElement } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { NewRepartitionResults } from "./NewRepartitionResults";
import { GroupTitles } from "./GroupTitles";

//const current= api.repartitions.filter((rep) => rep.status ="CREATING");

//A corriger

const groupnames = GroupTitles(4);

const Titlecards = () => (

    <Container className="mt-5">
      {groupnames.map((title) => (
        <Card className="text-left">
          <Card.Title>
          {/*<EditableLabel text={title}/>*/}
            </Card.Title>
        </Card>
      ))}
    </Container>
  )

export const Groups = () => (
  <NewRepartitionResults><Titlecards /></NewRepartitionResults>
);
