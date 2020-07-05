import React from "react";
import { Campaign } from "../../models/repartitions";
import { decidePlural } from "../../utils/format";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";
import dayjs from "dayjs";

/**
 * Display the results of a Poll in a `Card`.
 * The question is the title of the card.
 * The results are displayed as progress bars, with colours depending on the
 * rank of the choice.
 */
export const RepartitionCard = ({ campaign }: { campaign: Campaign }) => (
  <Card>
    <Card.Header>
      <Card.Title as="h3">{campaign.name}</Card.Title>
    </Card.Header>
  </Card>
);
