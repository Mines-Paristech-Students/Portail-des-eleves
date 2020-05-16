import React, { useContext, useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { User } from "../../../models/user";
import { Form, Card, Row, Container, Button } from "react-bootstrap";
import {
    api,
    useBetterPaginatedQuery,
    useBetterQuery,
} from "../../../services/apiService";
import { Loading } from "../../utils/Loading";
import { Pagination } from "../../utils/Pagination";
import { DebounceInput } from "react-debounce-input";
import { ToastContext, ToastLevel } from "../../utils/Toast";

export const AssociationMarketplaceCounter = ({ association }) => {
    const [customer, setCustomer] = useState<User | null>(null);

    return (
        <>
            <PageTitle>
                {customer !== null ? (
                    <span
                        className="fe fe-arrow-left text-primary"
                        onClick={() => setCustomer(null)}
                    />
                ) : null}
                Comptoir {customer ? ` - ${customer.id}` : null}
            </PageTitle>
            {customer === null ? (
                <CustomerSelecter setCustomer={setCustomer} />
            ) : (
                <CounterOrderMaker
                    marketplaceId={association.id}
                    customer={customer}
                    resetCustomer={() => setCustomer(null)}
                />
            )}
        </>
    );
};

const CustomerSelecter = ({ setCustomer }) => {
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
                <div className="row">
                    {data.results.map((user) => (
                        <div
                            className="col-lg-2 col-sm-3 col-6 p-2"
                            onClick={() => setCustomer(user)}
                            key={user.id}
                        >
                            <div className="card mb-0">
                                <div className="card-body text-center p-3">
                                    <span className="avatar avatar-xxl">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </span>
                                    <p className="text-muted mt-2">{user.id}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return null;
};
const CounterOrderMaker = ({ marketplaceId, customer, resetCustomer }) => {
    const {
        data: balance,
        status: balanceStatus,
        error: balanceError,
    } = useBetterQuery(
        ["marketplace.balance.get", marketplaceId, customer.id],
        api.marketplace.balance.get
    );

    const newToast = useContext(ToastContext);
    const [searchValue, setSearchValue] = useState("");
    const [basket, setBasket] = useState<object>({});

    const addToBasket = (product) => {
        let newBasket = { ...basket };
        if (!newBasket.hasOwnProperty(product.id)) {
            newBasket[product.id] = {
                product: product,
                quantity: 0,
                status: "idle",
            };
        }

        if (product.numberLeft >= newBasket[product.id].quantity + 1) {
            newBasket[product.id].quantity += 1;
        }
        setBasket(newBasket);
    };

    const removeFromBasket = (product) => {
        let newBasket = { ...basket };
        newBasket[product.id].quantity -= 1;

        if (newBasket[product.id].quantity <= 0) {
            delete newBasket[product.id];
        }

        setBasket(newBasket);
    };

    const makeOrder = async () => {
        const orders = Object.keys(basket).map((key) => basket[key]);
        let error = false;

        for (let order of orders) {
            let { product, quantity } = order;

            let newBasket = { ...basket };
            newBasket[product.id].status = "loading";
            setBasket(newBasket);

            try {
                await api.transactions.create(product, quantity, customer);
                let newBasket = { ...basket };
                newBasket[product.id].status = "success";
                setBasket(newBasket);
            } catch (e) {
                let newBasket = { ...basket };
                newBasket[product.id].status = "error";
                setBasket(newBasket);

                newToast({
                    message: `Erreur lors du passage de la commande : ${e}`,
                    level: ToastLevel.Error,
                });

                error = true;
            }
        }

        if (!error) {
            setBasket({});
            resetCustomer();
            newToast({
                message: `Commande passé avec succès`,
                level: ToastLevel.Success,
            });
        }
    };

    return (
        <>
            <Card>
                <Card.Header>
                    Solde :{" "}
                    {balanceStatus == "loading" ? (
                        <em>Chargement</em>
                    ) : balanceStatus == "error" ? (
                        <em>Erreur {balanceError} : balance</em>
                    ) : (
                        `${(balance as { balance: number }).balance}€`
                    )}
                </Card.Header>
            </Card>

            {/* Search and display products */}
            <DebounceInput
                className="form-control input-lg mb-2"
                type="text"
                placeholder="Chercher un produit..."
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                debounceTimeout={300}
                minLength={2}
            />

            <Container>
                <Row>
                    <Pagination
                        apiKey={[
                            "marketplace.products.search",
                            marketplaceId,
                            { search: searchValue },
                        ]}
                        apiMethod={api.products.list}
                        render={(products) =>
                            products.map((product) => (
                                <div
                                    className={"col-lg-3 col-sm-4 col-6 p-1"}
                                    key={product.id}
                                >
                                    <Card
                                        className={"m-0"}
                                        onClick={() => addToBasket(product)}
                                    >
                                        <Card.Body
                                            className={"p-3 text-center"}
                                        >
                                            {product.name}
                                            <br />
                                            <small className="text-muted">
                                                {product.price}€ /{" "}
                                                {product.numberLeft > -1
                                                    ? `${
                                                          product.numberLeft -
                                                          (basket[product.id]
                                                              ?.quantity || 0)
                                                      } restants`
                                                    : ""}
                                            </small>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                        }
                    />
                </Row>
            </Container>

            {/* Show order summary */}
            {Object.keys(basket).length > 0 ? (
                <>
                    <Card className={"mt-5"}>
                        <Card.Header>
                            <Card.Title>Commande</Card.Title>
                        </Card.Header>
                        <div className="table-responsive">
                            <div className="dataTables_wrapper no-footer">
                                <table
                                    className="table card-table table-vcenter datatable dataTable no-footer table-striped"
                                    role="grid"
                                >
                                    <tbody>
                                        {Object.keys(basket)
                                            .map((key) => basket[key])
                                            .map(
                                                ({
                                                    product,
                                                    quantity,
                                                    status,
                                                }) => (
                                                    <tr
                                                        role="row"
                                                        key={product.id}
                                                    >
                                                        <td>
                                                            {product.name}{" "}
                                                            <small className="muted">
                                                                x{quantity}
                                                            </small>
                                                        </td>
                                                        <td
                                                            className={
                                                                "text-right pr-0"
                                                            }
                                                        >
                                                            {product.price} x{" "}
                                                            {quantity} =
                                                        </td>
                                                        <td className={"pl-1"}>
                                                            {product.price *
                                                                quantity}
                                                            €
                                                        </td>
                                                        {status == "idle" ? (
                                                            <td
                                                                className={
                                                                    "text-danger text-right"
                                                                }
                                                            >
                                                                <span
                                                                    className="fe fe-delete"
                                                                    onClick={() =>
                                                                        removeFromBasket(
                                                                            product
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        ) : status ==
                                                          "loading" ? (
                                                            <span className="fe fe-upload" />
                                                        ) : status ==
                                                          "success" ? (
                                                            <span className="text-success fe fe-check" />
                                                        ) : (
                                                            <span className="text-danger fe fe-alert-octagon" />
                                                        )}
                                                    </tr>
                                                )
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Card.Footer>
                            <Button
                                variant={"success"}
                                size={"sm"}
                                className="float-right"
                                onClick={makeOrder}
                            >
                                <span className="fe fe-shopping-cart" /> Passer
                                la commande
                            </Button>
                            <strong>
                                Total :{" "}
                                {Object.keys(basket)
                                    .map((key) => basket[key])
                                    .map(
                                        ({ product, quantity }) =>
                                            product.price * quantity
                                    )
                                    .reduce((acc, val) => acc + val, 0)}
                                €
                            </strong>
                        </Card.Footer>
                    </Card>
                </>
            ) : null}
        </>
    );
};
