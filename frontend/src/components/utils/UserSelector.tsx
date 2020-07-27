import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { Row, Card } from "react-bootstrap";
import "./avatar/user_avatar.css";
import { api } from "../../services/apiService";
import { Pagination } from "./Pagination";
import { PageTitle } from "./PageTitle";
import { UserAvatarCard } from "./avatar/UserAvatarCard";
import { User } from "../../models/user";

export const UserSelector = ({
  setUser,
  title,
  helper = "",
  inCard = false,
  queryParams = {},
  apiKey = "users.list.search",
  apiMethod = api.users.list,
  getUser = (user) => user,
}: {
  setUser: (user) => void;
  title: string;
  helper?: string;
  inCard?: boolean;
  queryParams?: object;
  apiKey?: string;
  apiMethod?: any;
  getUser?: (user) => User;
}) => {
  const [searchValue, setSearchValue] = useState("");

  const body = (
    <>
      <Pagination
        apiKey={[
          apiKey,
          { search: searchValue, page_size: 20, ...queryParams },
        ]}
        apiMethod={apiMethod}
        render={(users, paginationControl) => (
          <>
            <DebounceInput
              className="form-control input-lg"
              type="text"
              placeholder="Chercher un nom"
              debounceTimeout={300}
              minLength={2}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Row>
              {users &&
                users.map((user) => {
                  const id = getUser(user).id;
                  return <div
                    className="col-lg-2 col-sm-3 col-6 p-2"
                    onClick={() => setUser(user)}
                    key={id}
                  >
                    <UserAvatarCard
                      userId={id}
                      className="h-100 cursor-pointer"
                      link={false}
                    >
                      <p className="text-muted text-center text-truncate mt-3 mb-0 px-2">
                        {id}
                      </p>
                    </UserAvatarCard>
                  </div>
                })}
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <div>{paginationControl}</div>
            </div>
          </>
        )}
      />
    </>
  );

  return inCard ? (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Body>
        {body}
        <p className="text-muted text-center">{helper}</p>
      </Card.Body>
    </Card>
  ) : (
    <>
      <PageTitle>{title}</PageTitle>
      <p className="text-muted text-center">{helper}</p>

      {body}
    </>
  );
};
