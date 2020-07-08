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
import { ListEventsApiParameters } from "../../../../services/api/events";
import { Association } from "../../../../models/associations/association";
import { useURLState } from "../../../../utils/useURLState";
import { AssociationLayout } from "../../Layout";
import { SidebarSeparator, SidebarSpace } from "../../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../../utils/sidebar/SidebarInputSearch";
import { SidebarSection } from "../../../utils/sidebar/SidebarSection";
import { CheckboxField } from "../../../utils/sidebar/CheckboxField";

/**
 * Display a list of `EventCard`. The whole component is placed in a `Container`.
 *
 * @param association the related association.
 * @param title displayed in a `PageTitle` component at the top.
 * @param apiParameters see `EventsListParameters` for the available filters and ordering. The key `association` is
 * omitted, given that it's already available with the `association` props.
 */

export const AssociationListEvents = ({
  association,
  title,
  apiParameters,
}: {
  association: Association;
  title: string;
  apiParameters: Omit<ListEventsApiParameters, "association">;
}) => {
  const [searchParameter, setSearchParameter] = useState<{ search: string }>({
    search: "",
  });

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
        </>
      }
    >
      <Pagination
        apiKey={[
          "events.list",
          {
            ...searchParameter,
            ...apiParameters,
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
            <PageTitle>{title}</PageTitle>

            <Row>
              {events.length > 0 ? (
                events.map((event) => (
                  <Col xs={12} md={{ span: 10, offset: 1 }} key={event.id}>
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
                <Col xs={12} md={{ span: 10, offset: 1 }}>
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
