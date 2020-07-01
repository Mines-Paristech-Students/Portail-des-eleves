import React, { ReactElement } from "react";
import { ListRepartitions } from "./ListRepartitions";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { NewRepartitionResults } from "./NewRepartitionResults";
import { RepartitionsLoading } from "./RepartitionsLoading";
import { RepartitionsError } from "./RepartitionsError";
import { NewRepartition } from "./NewRepartition";
import { GroupTitles } from "./GroupTitles";
import EditableLabel from 'react-inline-editing';
import { PollVotingForm } from "../polls/list/PollVotingForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PageTitle } from "../utils/PageTitle";
import { api } from "../../services/apiService";

//const current= api.repartitions.filter((rep) => rep.status ="CREATING");

//A corriger

const groupnames = GroupTitles(4);

const Titlecards = () => (

    <Container className="mt-5">
      {groupnames.map((title) => (
        <Card className="text-left">
          <Card.Title>
          <EditableLabel text={title}
            />
            </Card.Title>
        </Card>
      ))}
    </Container>
  )

export const Groups = () => (
  <NewRepartitionResults><Titlecards /></NewRepartitionResults>
);