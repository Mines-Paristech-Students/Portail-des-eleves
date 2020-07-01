import React from "react";
import { Association } from "../../../../../models/associations/association";
import { useParams } from "react-router";
import { PageTitle } from "../../../../utils/PageTitle";
import { LoansTable } from "./LoansTable";
import { api, useBetterQuery } from "../../../../../services/apiService";
import { Loanable } from "../../../../../models/associations/library";
import { Loading } from "../../../../utils/Loading";
import { Error } from "../../../../utils/Error";
import { LoanableCard } from "../../home/LoanableCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const AssociationManageLoans = ({
  association,
}: {
  association: Association;
}) => {
  const { loanableId } = useParams<{ loanableId: string }>();

  const { data: loanable, error, status } = useBetterQuery<Loanable>(
    ["loanables.get", { loanableId: loanableId }],
    api.loanables.get,
    { refetchOnWindowFocus: false }
  );

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <Error detail={error} />
  ) : status === "success" && loanable ? (
    <>
      <PageTitle>
        Gérer les demandes de{" "}
        <span className="font-italic">{loanable.name}</span>
      </PageTitle>

      <Container>
        <Row>
          <Col xs="12" md={{ offset: 1, span: 10 }}>
            <LoanableCard loanable={loanable} editButton comment />
          </Col>
        </Row>

        <Row>
          <Col>
            <LoansTable loanableId={loanableId} />
          </Col>
        </Row>
      </Container>
    </>
  ) : null;
};
