import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { Card, Container, Row } from "react-bootstrap";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { ProductCard } from "./ProductCard";

export const ProductSearch = ({ marketplaceId, basket, addToBasket }) => {
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
                        render={(products, paginationControl) => (
                            <>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            addToBasket={addToBasket}
                                            quantityOrdered={
                                                basket[product.id]?.quantity
                                            }
                                        />
                                    ))
                                ) : (
                                    <Card>
                                        <Card.Body
                                            className={"text-center text-muted"}
                                        >
                                            <em>Aucun résultat</em>
                                        </Card.Body>
                                    </Card>
                                )}

                                <div className="col-12">
                                    {paginationControl}
                                </div>
                            </>
                        )}
                    />
                </Row>
            </Container>
        </>
    );
};
