import React from "react";
import { PageTitle } from "../utils/PageTitle";
import { api } from "../../services/apiService";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { RepartitionsHome } from "./Home";
import { Pagination } from "../utils/Pagination";

export const RepartitionList = () => (
  <RepartitionsHome>
    <PageTitle>Répartitions</PageTitle>
    <Pagination
      apiKey={["campaigns.list"]}
      apiMethod={api.campaigns.list}
      render={(campaigns, paginationControl) => (
        <>
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className={"col-md-3 m-4"}>
              <Link to={`/repartitionView/${campaign.id}`}>
                <Card.Body>
                  <Card.Title>{campaign.name}</Card.Title>
                </Card.Body>
              </Link>
            </Card>
          ))}
          {paginationControl}
        </>
      )}
    />
  </RepartitionsHome>
);
