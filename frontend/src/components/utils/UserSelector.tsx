import React, { useState } from "react";
import { api, useBetterPaginatedQuery } from "../../services/apiService";
import { Loading } from "./Loading";
import { DebounceInput } from "react-debounce-input";
import { Row, Card } from "react-bootstrap";

export const UserSelector = ({ setCustomer }) => {
    const [searchValue, setSearchValue] = useState("");
    const { resolvedData: data, status, error } = useBetterPaginatedQuery<any>(
        ["users.list.search", { search: searchValue }],
        api.users.list
    );

    if (status === "loading") return <Loading />;
    else if (status === "error") return <p>`Something went wrong: ${error}`</p>;
    else if (data) {
        return (
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
                    {data.results.map((user) => (
                        <div
                            className="col-lg-2 col-sm-3 col-6 p-2"
                            onClick={() => setCustomer(user)}
                            key={user.id}
                        >
                            <Card className="mb-0">
                                <Card.Body className="text-center p-3">
                                    <span className="avatar avatar-xxl">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </span>
                                    <p className="text-muted mt-2">{user.id}</p>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </Row>
            </>
        );
    }

    return null;
};
