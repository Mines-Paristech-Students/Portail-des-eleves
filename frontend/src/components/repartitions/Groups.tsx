import React, { ReactElement } from "react";
import EditableLabel from "react-inline-editing";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { NewRepartitionResults } from "./NewRepartitionResults";
import Row from "react-bootstrap/Row";
import { PageTitle } from "../utils/PageTitle";
import Col from "react-bootstrap/Col";
import { GroupTitles } from "./GroupTitles";
import { RepartitionsHome } from "./Home";
import { RepartitionsLoading } from "./RepartitionsLoading";
import { RepartitionsError } from "./RepartitionsError";
import { Pagination } from "../utils/Pagination";
import { RepartitionCard } from "./RepartitionCard";
import { Campaign } from "../../models/repartitions";
import { api } from "../../services/apiService";

const Content = ({ campaigns, paginationControl }) => {
  const campaignsList = campaigns.filter(
    (campaign) => campaign.status === "OPEN"
  );

  return (
    <Container>
      {
        <Row>
          {campaignsList.map((campaign) =>
            GroupTitles(1).map((title) => (
              <Card className="text-left">
                <Card.Title>
                  {<EditableLabel text={campaign.groupsnumber} />}
                </Card.Title>
              </Card>
            ))
          )}
        </Row>
      }

      {paginationControl}
    </Container>
  );
};

// const groupnames = GroupTitles(4);

const Titlecards = () => (
  //{ current }: { current?: boolean }) => (
  <Container className="mt-5">
    <Pagination
      render={(campaigns: Campaign[], paginationControl) => (
        <Content
          //          current={current}
          campaigns={campaigns}
          paginationControl={paginationControl}
        />
      )}
      apiKey={[
        "campaigns.list",
        //        current ? { status: "OPEN" } : { status: "OPEN" },
      ]}
      apiMethod={api.campaigns.list}
      config={{ refetchOnWindowFocus: false }}
      paginationControlProps={{
        className: "justify-content-center mb-5",
      }}
      loadingElement={RepartitionsLoading}
      errorElement={RepartitionsError}
    />
  </Container>
);

export const Groups = () => (
  <NewRepartitionResults>
    <Titlecards />
  </NewRepartitionResults>
);
