import React, { useState } from "react";
import { api, useBetterPaginatedQuery } from "../../services/apiService";
import { Loading } from "./Loading";
import { DebounceInput } from "react-debounce-input";
import { Row } from "react-bootstrap";
import { Error } from "./Error";
import { UserAvatarCard } from "./avatar/UserAvatarCard";
import { Pagination } from "./Pagination";

export const UserSelector = ({ setUser }) => {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <Pagination
                apiKey={[
                    "users.list.search",
                    { search: searchValue, page_size: 20 },
                ]}
                apiMethod={api.users.list}
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
                            {users.map((user) => (
                                <div
                                    className="col-lg-2 col-sm-3 col-6 p-2"
                                    onClick={() => setUser(user)}
                                    key={user.id}
                                >
                                    <UserAvatarCard
                                        userId={user.id}
                                        className="h-100"
                                    >
                                        <p className="text-muted text-center text-truncate mt-3 mb-0 px-2">
                                            {user.id}
                                        </p>
                                    </UserAvatarCard>
                                </div>
                            ))}
                        </Row>
                        <div className="d-flex justify-content-center mt-4">
                            <div>{paginationControl}</div>
                        </div>
                    </>
                )}
            />
            <p className="text-muted text-center">
                Cliquez sur une carte pour séléctionner un élève
            </p>
        </>
    );
};
