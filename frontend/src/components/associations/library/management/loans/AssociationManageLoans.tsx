import React, { useState } from "react";
import { Association } from "../../../../../models/associations/association";
import { useParams } from "react-router";
import { PageTitle } from "../../../../utils/PageTitle";
import { LoansTable } from "./LoansTable";
import { api, useBetterQuery } from "../../../../../services/apiService";
import {
  Loanable,
  LoanStatus,
} from "../../../../../models/associations/library";
import { Loading } from "../../../../utils/Loading";
import { Error } from "../../../../utils/Error";
import { LoanableCard } from "../../home/LoanableCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AssociationLayout } from "../../../Layout";
import { SidebarSeparator } from "../../../../utils/sidebar/Sidebar";
import { SidebarSection } from "../../../../utils/sidebar/SidebarSection";
import {
  CheckboxField,
  updateStatus,
} from "../../../../utils/sidebar/CheckboxField";

// Useful for generating the `CheckboxField`.
const checkboxFieldsData: [LoanStatus, string][] = [
  ["PENDING", "En attente"],
  ["ACCEPTED", "Acceptés"],
  ["REJECTED", "Refusés"],
  ["BORROWED", "Empruntés"],
  ["RETURNED", "Retournés"],
  ["CANCELLED", "Annulés"],
];

export const AssociationManageLoans = ({
  association,
}: {
  association: Association;
}) => {
  const { loanableId } = useParams<{ loanableId: string }>();

  const [statusParams, setStatusParams] = useState<{ status: LoanStatus[] }>({
    status: ["PENDING", "ACCEPTED", "BORROWED"],
  });

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
    <AssociationLayout
      association={association}
      additionalSidebar={
        <>
          <SidebarSeparator />
          <SidebarSection
            title="Voir statuts…"
            retractable={false}
            retractedByDefault={false}
          >
            {checkboxFieldsData.map(([value, label]) => (
              <CheckboxField
                key={value}
                label={label}
                state={statusParams.status.includes(value)}
                onChange={(checked) =>
                  setStatusParams((oldStatus) => ({
                    status: updateStatus(checked, value, oldStatus.status),
                  }))
                }
              />
            ))}
          </SidebarSection>
        </>
      }
    >
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
            <LoansTable loanableId={loanableId} apiParameters={statusParams} />
          </Col>
        </Row>
      </Container>
    </AssociationLayout>
  ) : null;
};
