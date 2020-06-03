import React, { useContext, useEffect, useState } from "react";
import { api, useBetterQuery } from "../../services/apiService";
import Select from "react-select";
import { ErrorMessage } from "./ErrorPage";
import { Loading } from "./Loading";
import { Col, Row } from "react-bootstrap";
import { User } from "../../models/user";
import { UserAvatarCard } from "./avatar/UserAvatarCard";
import { Size } from "../../utils/size";
import { UserContext } from "../../services/authService";
import { DebounceInput } from "react-debounce-input";

export const MultiUserSelector = ({ onChange }) => {
    const loggedUser = useContext(UserContext);

    const [searchValue, setSearchValue] = useState("");
    const [promotion, setPromotion] = useState<any>(null);

    const [userStatus, setUserStatus] = useState<
        "loading" | "error" | "success"
    >();
    const [userError, setUserError] = useState<any>();

    const [users, setUsers] = useState<{
        [key: string]: { user: User; selected: boolean };
    }>({});

    const selectedUsers = Object.entries(users)
        .filter(([_, { selected }]) => selected)
        .map(([_, { user }]) => user)
        .sort(compareUsers);

    const unSelectedUsers = Object.entries(users)
        .filter(([_, { selected }]) => !selected)
        .map(([_, { user }]) => user)
        .sort(compareUsers);

    const {
        data: promotions,
        status: promotionsStatus,
        error: promotionsError,
    } = useBetterQuery<{
        promotions: string[];
    }>(["promotions.list"], api.users.listPromotions, {
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setPromotion({
            value: loggedUser?.promotion || "",
            label: loggedUser?.promotion || "",
        });
    }, [loggedUser]);

    useEffect(() => {
        if (!promotion) {
            return;
        }

        setUserStatus("loading");
        api.users
            .list({
                promotion: promotion.value,
                search: searchValue,
                page_size: 1000,
            })
            .then((response) => {
                setUserStatus("success");
                let newUsers = { ...users };
                for (let userId in users) {
                    if (!users[userId].selected) {
                        delete newUsers[userId];
                    }
                }

                response.results.forEach((user) => {
                    if (!newUsers.hasOwnProperty(user.id))
                        newUsers[user.id] = {
                            selected: false,
                            user: user,
                        };
                });

                setUsers(newUsers);
            })
            .catch((error) => {
                setUserStatus("error");
                setUserError(error);
            });

        // Avoid to trigger infinite update by putting users as a dep
        // eslint-disable-next-line
    }, [promotion, searchValue]);

    const addUser = (user) => {
        setUsers((users) => ({
            ...users,
            ...{
                [user.id]: {
                    user: user,
                    selected: true,
                },
            },
        }));
    };

    const removeUser = (user) => {
        if (user.promotion === promotion.value) {
            setUsers((users) => ({
                ...users,
                ...{
                    [user.id]: {
                        user: user,
                        selected: false,
                    },
                },
            }));
        } else {
            setUsers((users) => {
                let newUsers = { ...users };
                delete newUsers[user.id];
                return newUsers;
            });
        }
    };

    useEffect(() => {
        onChange(selectedUsers);
    }, [selectedUsers, onChange]);

    return userStatus === "error" ? (
        <ErrorMessage>{userError}</ErrorMessage>
    ) : promotionsStatus === "error" ? (
        <ErrorMessage>{promotionsError}</ErrorMessage>
    ) : promotionsStatus === "loading" ? (
        <Loading />
    ) : (
        <Row className={"border bg-white"} style={{ height: "80vh" }}>
            <Col md={3} className={"p-0 border-right overflow-auto"}>
                <Select
                    value={promotion}
                    onChange={(v, _) => setPromotion(v)}
                    options={
                        promotions
                            ? promotions.promotions.map((promotion) => ({
                                  value: promotion,
                                  label: promotion,
                              }))
                            : []
                    }
                    placeholder="Filtrer par promotion…"
                    className={"rounded-0 border-bottom"}
                    styles={selectStyles}
                />

                <DebounceInput
                    className={
                        "form-control rounded-0 border-top-0 border-left-0 border-right-0"
                    }
                    placeholder={"Rechercher quelqu'un..."}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="text"
                    debounceTimeout={300}
                    minLength={2}
                />

                {unSelectedUsers.length > 0 && (
                    <p
                        className={"text-primary p-4 m-0"}
                        onClick={() => unSelectedUsers.forEach(addUser)}
                    >
                        Tout ajouter
                    </p>
                )}

                <ul className="list-group list-group-flush">
                    {unSelectedUsers.length > 0 ? (
                        unSelectedUsers.map((user) => (
                            <li
                                className="list-group-item border-bottom"
                                key={user.id}
                                onClick={() => addUser(user)}
                            >
                                {user.firstName} {user.lastName}
                            </li>
                        ))
                    ) : (
                        <p className="text-center mt-4 text-muted">
                            <em>Aucun utilisateur restant</em>
                        </p>
                    )}
                </ul>
            </Col>
            <Col md={9} className={"bg-light overflow-auto"}>
                <Row className={"pt-2 pr-2"}>
                    {selectedUsers.length > 0 && (
                        <p
                            className="text-danger text-right col col-12"
                            onClick={() => selectedUsers.forEach(removeUser)}
                        >
                            Tout retirer
                        </p>
                    )}
                    {selectedUsers.map((user) => (
                        <Col lg={2} sm={6} key={user.id}>
                            <UserAvatarCard
                                userId={user.id}
                                className={"p-2"}
                                size={Size.Large}
                            >
                                <p className="text-muted text-center text-truncate mt-3 mb-0">
                                    <span
                                        className="btn btn-secondary btn-icon rounded-circle"
                                        onClick={() => removeUser(user)}
                                        style={{
                                            position: "absolute",
                                            top: "-18px",
                                            right: "-18px",
                                            transform: "scale(0.8)",
                                        }}
                                    >
                                        <i className="fe fe-x" />
                                    </span>
                                    {user.firstName} {user.lastName}
                                </p>
                            </UserAvatarCard>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    );
};

const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: "0",
        border: "none",
    }),
};

function compareUsers(u1: User, u2: User): number {
    if (u1.id > u2.id) return 1;
    if (u2.id > u1.id) return -1;

    return 0;
}
