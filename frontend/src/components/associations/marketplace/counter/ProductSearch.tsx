import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { Card, Row, Container, Col } from "react-bootstrap";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { ProductCard } from "./ProductCard";

export const ProductSearch = ({
    marketplaceId,
    basket,
    addToBasket,
    compressed,
}) => {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
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
                            { search: searchValue, page_size: 12 },
                        ]}
                        apiMethod={api.products.list}
                        paginationControlProps={{
                            className: "justify-content-center mb-5",
                        }}
                        render={(products, paginationControl) => (
                            <>
                                {products.map((product) => (
                                    <Col
                                        key={product.id}
                                        lg={compressed ? 6 : 3}
                                        sm={compressed ? 6 : 4}
                                        xs={6}
                                    >
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            addToBasket={addToBasket}
                                            quantityOrdered={
                                                basket[product.id]?.quantity
                                            }
                                        />
                                    </Col>
                                ))}

                                {products.length > 0 && (
                                    <Card>
                                        <Card.Body
                                            className={"text-center text-muted"}
                                        >
                                            <em>Aucun résultat</em>
                                        </Card.Body>
                                    </Card>
                                )}
                                {paginationControl}
                            </>
                        )}
                    />
                </Row>
            </Container>
        </>
    );
};
