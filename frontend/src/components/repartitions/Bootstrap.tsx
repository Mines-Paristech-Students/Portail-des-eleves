import React from "react";
import { useParams } from "react-router-dom";

import { api, useBetterQuery } from "../../services/apiService";
import { ErrorMessage } from "../utils/ErrorPage";
import { Campaign } from "../../models/repartitions";
import { Loading } from "../utils/Loading";
import { PageTitle } from "../utils/PageTitle";
import { RepartitionsHome } from "./Home";
import Container from "react-bootstrap/Container";
import { RepartitionEdit } from "./RepartitionEdit";

export const RepartitionBootstrap = ({ render: Render, match, ...props }) => {
  const { repartitionId } = useParams<{ repartitionId: string }>();

  const { data: campaign, error, status } = useBetterQuery<Campaign>(
    ["campaigns.get", repartitionId],
    api.campaigns.get,
    {
      refetchOnWindowFocus: false,
    }
  );

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <ErrorMessage> `Une erreur est apparue: ${error}` </ErrorMessage>
  ) : status === "success" && campaign ? (
    <Container>
      <PageTitle> {campaign.name} </PageTitle>
      <Render campaign={campaign} {...props} />
    </Container>
  ) : null;
};
