import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { Card, Row, Container, Col } from "react-bootstrap";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { ProductCard } from "./ProductCard";
import "./product-search.css";

export const ProductSearch = ({ subscriber, marketplaceId, basket, addToBasket }) => {
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
              className: "justify-content-center mt-2 mb-5",
            }}
            render={(products, paginationControl) => (
              <Row>
                {products.map((product) => (
                  <Col key={product.id} xs={6}>
                    <ProductCard
                      key={product.id}
                      subscriber={subscriber}
                      product={product}
                      addToBasket={addToBasket}
                      className={"cursor-pointer"}
                      quantityOrdered={basket[product.id]?.quantity}
                    />
                  </Col>
                ))}

                {products.length === 0 && (
                  <Card>
                    <Card.Body className={"text-center text-muted"}>
                      <em>Aucun résultat</em>
                    </Card.Body>
                  </Card>
                )}

                <Col>{paginationControl}</Col>
              </Row>
            )}
          />
        </Row>
      </Container>
    </>
  );
};
