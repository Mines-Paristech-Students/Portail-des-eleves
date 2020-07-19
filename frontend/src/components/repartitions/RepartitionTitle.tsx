import { useParams } from "react-router";
import { api } from "../../services/apiService";
import React, { useContext } from "react";
import { ToastContext } from "../utils/Toast";
import { Campaign } from "../../models/repartitions";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import Container from "react-bootstrap/Container";
import { MutateRepartitionForm } from "./MutateRepartitionForm";
import { RepartitionsHome } from "./Home";
import { PageTitle } from "../utils/PageTitle";

export const RepartitionTitle = ({ campaign }: { campaign: Campaign }) => {
  return (
    <RepartitionsHome>
      <PageTitle> {campaign.name} </PageTitle>
    </RepartitionsHome>
  );
};