import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { api, useBetterQuery } from "../../services/apiService";
import Select from "react-select";
import { ErrorMessage } from "./ErrorPage";
import { Loading } from "./Loading";
import { Col, Row, Container } from "react-bootstrap";
import { User } from "../../models/user";
import { UserAvatarCard } from "./avatar/UserAvatarCard";
import { Size } from "../../utils/size";
import { UserContext } from "../../services/authService";
import { DebounceInput } from "react-debounce-input";

type SelectChoice = {
    value: string;
    label: string;
};

/**
 * MultiUserSelector is a component used to select users by batch. It differs
 * from the `SelectUsers` because it's made for dozens of users, while
 * `SelectUsers` is good for half a dozen.
 * @param onChange a callback called every time selected a user is
 * selected/unselected
 */
export const MultiUserSelector = ({ onChange }) => {
    const loggedUser = useContext(UserContext);

    const [searchValue, setSearchValue] = useState("");
    const [promotion, setPromotion] = useState<SelectChoice>({
        value: loggedUser?.promotion || "",
        label: loggedUser?.promotion || "",
    });

    const [userStatus, setUserStatus] = useState<
        "loading" | "error" | "success"
    >();
    const [userError, setUserError] = useState<any>();

    /* We are doing many set operations (check if a user is selected,
     * change the user from list... on a non-small sample (>100).
     * To allow faster list switching, we add a "selected" field to specify which
     * set a user belongs to and simply switch it when we want to transfer the user.
     * Displaying the users is made simple by using the selectedUsers and
     * unselectedUsers variables.
     */
    const [users, setUsers] = useState<{
        [key: string]: { user: User; selected: boolean };
    }>({});

    const selectedUsers = Object.entries(users)
        .filter(([_, { selected }]) => selected)
        .map(([_, { user }]) => user)
        .sort(compareUsers);

    const unselectedUsers = Object.entries(users)
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
                setUsers((users) => {
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
                    return newUsers;
                });
            })
            .catch((error) => {
                setUserStatus("error");
                setUserError(error);
            });

        // Avoid to trigger infinite update by putting users as a dep
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
        <Container fluid={true}>
            <Row className={"border bg-white"} style={{ height: "80vh" }}>
                <Col md={3} className={"p-0 border-right overflow-auto"}>
                    <Select
                        value={promotion}
                        onChange={(v) => setPromotion(v as SelectChoice)}
                        options={
                            promotions
                                ? promotions.promotions.map((promotion) => ({
                                      value: promotion,
                                      label: promotion,
                                  }))
                                : []
                        }
                        placeholder="Filtrer par promotion…"
                        noOptionsMessage={() => "Aucun résultat"}
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

                    {unselectedUsers.length > 0 && (
                        <button
                            className={"btn btn-link p-4 m-0"}
                            onClick={() => unselectedUsers.forEach(addUser)}
                        >
                            Tout ajouter
                        </button>
                    )}

                    <ul className="list-group list-group-flush">
                        {unselectedUsers.length > 0 ? (
                            unselectedUsers.map((user) => (
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
                            <p className={"text-right col col-12"}>
                                <button
                                    className="btn btn-link text-danger"
                                    onClick={() =>
                                        selectedUsers.forEach(removeUser)
                                    }
                                >
                                    Tout retirer
                                </button>
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
                                            style={avatarStyle}
                                        >
                                            <i className="fe fe-x" />
                                        </span>
                                        {user.firstName} {user.lastName}
                                    </p>
                                </UserAvatarCard>
                            </Col>
                        ))}

                        {selectedUsers.length === 0 && (
                            <p
                                className={
                                    "text-center text-muted lead col mt-6"
                                }
                            >
                                Personne n'a été sélectionné pour l'instant
                            </p>
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: "0",
        border: "none",
    }),
};

const avatarStyle: CSSProperties = {
    position: "absolute",
    top: "-18px",
    right: "-18px",
    transform: "scale(0.8)",
};

const compareUsers = (u1: User, u2: User): number =>
    u1.lastName.localeCompare(u2.lastName);
