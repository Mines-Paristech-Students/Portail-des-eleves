import React, { useState } from "react";
import { AssociationLayout } from "../../Layout";
import { Association } from "../../../../models/associations/association";
import Container from "react-bootstrap/Container";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import Row from "react-bootstrap/Row";
import { LoanableCard } from "./LoanableCard";
import Col from "react-bootstrap/Col";
import { PageTitle } from "../../../utils/PageTitle";
import { SidebarSeparator, SidebarSpace } from "../../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../../utils/sidebar/SidebarInputSearch";
import { Instructions } from "../../../utils/Instructions";
import { Link } from "react-router-dom";
import { CheckboxField } from "../../../utils/sidebar/CheckboxField";
import { SidebarSection } from "../../../utils/sidebar/SidebarSection";

export const AssociationLibraryHome = ({
  association,
}: {
  association: Association;
}) => {
  const [searchParams, setSearchParams] = useState({});
  const [statusParams, setStatusParams] = useState({
    status: ["AVAILABLE", "REQUESTED"],
  });
  return (
    <AssociationLayout
      association={association}
      additionalSidebar={
        <>
          <SidebarSeparator />
          <SidebarInputSearch
            setParams={setSearchParams}
            placeholder="Chercher un objet"
          />
          <SidebarSpace />
          <SidebarSection
            title="Voir les objets..."
            retractable={false}
            retractedByDefault={false}
          >
            {/*
              In this component, the AVAILABLE and REQUESTED status are treated
              as the same (“Disponible”).
               */}
            <CheckboxField
              label={"Disponibles"}
              state={
                statusParams.status.includes("AVAILABLE") &&
                statusParams.status.includes("REQUESTED")
              }
              onChange={(ticked) =>
                setStatusParams((oldStatus) => ({
                  status: ticked
                    ? [...oldStatus.status, "AVAILABLE", "REQUESTED"]
                    : oldStatus.status.filter(
                        (x) => x !== "AVAILABLE" && x !== "REQUESTED"
                      ),
                }))
              }
            />
            <CheckboxField
              label={"Indisponibles"}
              state={statusParams.status.includes("BORROWED")}
              onChange={(ticked) =>
                setStatusParams((oldStatus) => ({
                  status: ticked
                    ? [...oldStatus.status, "BORROWED"]
                    : oldStatus.status.filter((x) => x !== "BORROWED"),
                }))
              }
            />
          </SidebarSection>
        </>
      }
    >
      <Container>
        <PageTitle>Bibliothèque</PageTitle>

        <Pagination
          apiMethod={api.loanables.list}
          apiKey={[
            "loanables.list",
            {
              library: association.id,
              page_size: 10,
              ...searchParams,
              ...statusParams,
            },
          ]}
          paginationControlProps={{
            className: "justify-content-center mb-5",
          }}
          render={(loanables, paginationControl) =>
            loanables.length > 0 ? (
              <>
                <Row>
                  {loanables.map((loanable) => (
                    <Col key={loanable.id} xs={12} lg={6}>
                      <LoanableCard loanable={loanable} loanButton cardStatus />
                    </Col>
                  ))}
                </Row>
                {paginationControl}
              </>
            ) : (
              <Instructions
                title="Bibliothèque"
                emoji="📚"
                emojiAriaLabel="Des livres"
              >
                La bibliothèque est vide pour l'instant.
                <br />
                {association.myRole?.permissions?.includes("library") ? (
                  <Link
                    to={`/associations/${association.id}/bibliotheque/gestion`}
                  >
                    Ajouter des objets.
                  </Link>
                ) : (
                  "Revenez quand les responsables de l'association l'auront garnie !"
                )}
              </Instructions>
            )
          }
        />
      </Container>
    </AssociationLayout>
  );
};
