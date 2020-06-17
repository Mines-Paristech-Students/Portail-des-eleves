import React, { useState } from "react";
import { Pagination } from "../../utils/Pagination";
import { api, useBetterQuery } from "../../../services/apiService";
import { UserAvatarCard } from "../../utils/avatar/UserAvatarCard";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import { Link } from "react-router-dom";
import Select from "react-select";
import InputGroup from "react-bootstrap/InputGroup";
import { DebounceInput } from "react-debounce-input";

export const Trombi = () => {
  const { data: promotions } = useBetterQuery<{
    promotions: string[];
  }>(["listPromotions"], api.users.listPromotions, {
    refetchOnWindowFocus: false,
  });

  // The search key sent to `api.users.list`. It is debounced thanks to the `searchInputValue` hooks.
  const [searchKey, setSearchKey] = useState("");

  // The promotions filter sent to `api.users.list`.
  const [promotionsFilter, setPromotionsFilter] = useState<any[]>([]);

  return (
    <Container className="mt-5">
      <PageTitle>Trombinoscope</PageTitle>

      <Row className="mb-5">
        <Col md={3}>
          <InputGroup className="mb-3" tabIndex={0}>
            <div className="input-icon w-100">
              <DebounceInput
                className="form-control"
                placeholder="Rechercher…"
                debounceTimeout={500}
                onChange={(event) => setSearchKey(event.target.value)}
              />

              <span className="input-icon-addon">
                <i className="fe fe-search" />
              </span>
            </div>
          </InputGroup>
        </Col>
        <Col md={{ span: 3, offset: 6 }}>
          <Select
            value={promotionsFilter}
            options={
              promotions
                ? promotions.promotions.map((promotion) => ({
                    value: promotion,
                    label: promotion,
                  }))
                : []
            }
            closeMenuOnSelect={false}
            isMulti
            placeholder="Filtrer par promotion…"
            onChange={(value, _) => setPromotionsFilter(value)}
          />
        </Col>
      </Row>

      <Pagination
        apiKey={[
          "users.list",
          {
            search: searchKey,
            promotion__in: (promotionsFilter || [])
              .map((promotion) => promotion.value)
              .join(","),
          },
        ]}
        apiMethod={api.users.list}
        config={{ refetchOnWindowFocus: false }}
        render={(users, paginationControl) => {
          return (
            <>
              <Row>
                {users.length > 0 ? (
                  users
                    // Order by decreasing alphabetical order.
                    .sort((userA, userB) => userB.id.localeCompare(userA.id))
                    .map((user) => (
                      <Col xs={6} lg={2} key={user.id} className="mb-5">
                        <UserAvatarCard
                          userId={user.id}
                          className="h-100"
                          link={true}
                        >
                          <p className="text-muted text-center text-truncate mt-3 mb-0 px-2">
                            <Link
                              className="text-reset"
                              to={`/profils/${user.id}`}
                            >
                              {user.id}
                            </Link>
                          </p>
                        </UserAvatarCard>
                      </Col>
                    ))
                ) : (
                  <Col className="text-center">
                    <p>Pas de résultats.</p>
                  </Col>
                )}
              </Row>

              {paginationControl}
            </>
          );
        }}
      />
    </Container>
  );
};
