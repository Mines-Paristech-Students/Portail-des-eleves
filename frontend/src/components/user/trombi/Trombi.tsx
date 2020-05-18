import React, { useEffect, useState } from "react";
import { Pagination } from "../../utils/Pagination";
import { api, useBetterQuery } from "../../../services/apiService";
import { UserAvatarCard } from "../../utils/avatar/UserAvatarCard";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import { Link } from "react-router-dom";
import Select, { OptionsType, ValueType } from "react-select";
import InputGroup from "react-bootstrap/InputGroup";

export const Trombi = () => {
    const { data: promotions } = useBetterQuery<{
        promotions: string[];
    }>(["listPromotions"], api.users.listPromotions, {
        refetchOnWindowFocus: false,
    });

    // react-select requires an `options` field of a special type. These hooks handle this.
    const [promotionsOptions, setPromotionsOptions] = useState<
        OptionsType<{ value: string; label: string }>
    >([]);

    useEffect(() => {
        if (promotions) {
            setPromotionsOptions(
                promotions.promotions.map((promotion) => {
                    return { value: promotion, label: promotion };
                })
            );
        }
    }, [promotions]);

    // The search key sent to `api.users.list`. It is debounced thanks to the `searchInputValue` hooks.
    const [searchKey, setSearchKey] = useState<string>("");
    const [searchInputValue, setSearchInputValue] = useState<string>("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchKey(searchInputValue);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchInputValue]);

    // The promotions filter sent to `api.users.list`.
    const [promotionsFilter, setPromotionsFilter] = useState<
        ValueType<{ value: string; label: string }>
    >([]);

    return (
        <Container className="mt-5">
            <PageTitle>Trombinoscope</PageTitle>

            <Row className="mb-5">
                <Col md={3}>
                    <InputGroup className="mb-3" tabIndex={0}>
                        <div className="input-icon w-100">
                            <FormControl
                                placeholder="Rechercher…"
                                onChange={(event) =>
                                    setSearchInputValue(event.target.value)
                                }
                            />
                            <span className="input-icon-addon">
                                <i className="fe fe-search"></i>
                            </span>
                        </div>
                    </InputGroup>
                </Col>
                <Col md={{ span: 3, offset: 6 }}>
                    <Select
                        value={promotionsFilter}
                        options={promotionsOptions}
                        isMulti
                        placeholder="Filtrer par promotion…"
                        onChange={(newPromotions) =>
                            setPromotionsFilter(newPromotions)
                        }
                    />
                </Col>
            </Row>

            <Pagination
                apiKey={[
                    "users.list",
                    { searchKey: searchKey, promotions: promotionsFilter },
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
                                        .sort((userA, userB) =>
                                            userB.id.localeCompare(userA.id)
                                        )
                                        .map((user) => (
                                            <Col
                                                xs={6}
                                                lg={2}
                                                key={user.id}
                                                className="mb-5"
                                            >
                                                <UserAvatarCard
                                                    userId={user.id}
                                                    className="h-100"
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
