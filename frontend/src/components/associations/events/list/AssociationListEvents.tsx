import React, { useState } from "react";

import { api } from "../../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { LoadingAssociation } from "../../Loading";
import { PageTitle } from "../../../utils/PageTitle";
import { Pagination } from "../../../utils/Pagination";
import { EventCard } from "./EventCard";
import { Association } from "../../../../models/associations/association";
import { useURLState } from "../../../../utils/useURLState";
import { AssociationLayout } from "../../Layout";
import { SidebarSeparator, SidebarSpace } from "../../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../../utils/sidebar/SidebarInputSearch";
import { SidebarSection } from "../../../utils/sidebar/SidebarSection";
import {
  CheckboxField,
  updateStatus,
} from "../../../utils/sidebar/CheckboxField";
import { Link } from "react-router-dom";

/**
 * Display a list of `EventCard`. The whole component is placed in a `Container`.
 * This component defines its own sidebar.
 *
 * @param association the related association.
 */

export const AssociationListEvents = ({
  association,
}: {
  association: Association;
}) => {
  const [searchParameter, setSearchParameter] = useState<{ search: string }>({
    search: "",
  });
  const [timeParameter, setTimeParameter] = useURLState<
    ("NOW" | "AFTER" | "BEFORE")[]
  >(
    "time",
    ["NOW", "AFTER"],
    (data) => data.join("-"),
    (url) => url.split("-") as ("NOW" | "AFTER" | "BEFORE")[]
  );

  return (
    <AssociationLayout
      association={association}
      additionalSidebar={
        <>
          <SidebarSeparator />
          <SidebarInputSearch
            setParams={setSearchParameter}
            placeholder="Chercher un événement"
          />
          <SidebarSpace />
          <SidebarSection
            title="Voir les événements..."
            retractable={false}
            retractedByDefault={false}
          >
            <CheckboxField
              label={"En cours"}
              state={timeParameter.includes("NOW")}
              onChange={(checked) =>
                setTimeParameter(updateStatus(checked, "NOW", timeParameter))
              }
            />
            <CheckboxField
              label={"À venir"}
              state={timeParameter.includes("AFTER")}
              onChange={(checked) =>
                setTimeParameter(updateStatus(checked, "AFTER", timeParameter))
              }
            />
            <CheckboxField
              label={"Passés"}
              state={timeParameter.includes("BEFORE")}
              onChange={(checked) =>
                setTimeParameter(updateStatus(checked, "BEFORE", timeParameter))
              }
            />
          </SidebarSection>
        </>
      }
    >
      <Pagination
        apiKey={[
          "events.list",
          {
            ...searchParameter,
            // We do this to keep the special ordering (if there is no filter, the special ordering is not applied).
            time:
              timeParameter.length > 0
                ? timeParameter
                : ["NOW", "AFTER", "BEFORE"],
            association: association.id,
          },
        ]}
        apiMethod={api.events.list}
        loadingElement={LoadingAssociation}
        paginationControlProps={{
          className: "justify-content-center mb-5",
        }}
        render={(events, paginationControl) => (
          <Container className="mt-5">
            <div className="d-flex align-items-center">
              <PageTitle>Événements</PageTitle>
              {association.myRole?.permissions?.includes("event") && (
                <Link
                  to={`/associations/${association.id}/evenements/creer`}
                  className={
                    "btn btn-outline-primary btn-sm float-right ml-auto"
                  }
                >
                  <span className="fe fe-plus" /> Nouveau
                </Link>
              )}
            </div>

            <Row>
              {events.length > 0 ? (
                events.map((event) => (
                  <Col xs={12} key={event.id}>
                    <EventCard
                      event={event}
                      association={association}
                      canEdit={association.myRole?.permissions?.includes(
                        "event"
                      )}
                    />
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <Card>
                    <Card.Body className="px-7">
                      <p className="text-center">
                        Pas d’événement pour le moment.{" "}
                        <span role="img" aria-label="visage qui pleure">
                          😢
                        </span>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>

            {paginationControl}
          </Container>
        )}
      />
    </AssociationLayout>
  );
};
