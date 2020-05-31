import React, { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import { Product } from "./common/Product";
import { Link } from "react-router-dom";
import { SidebarSeparator, SidebarSpace } from "../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../utils/sidebar/SidebarInputSearch";
import { TagSearch } from "../../utils/tags/TagSearch";
import { AssociationLayout } from "../Layout";

export const AssociationMarketplaceProductAdministration = ({
    association,
}) => {
    const marketplaceId = association.id;

    const [searchParams, setSearchParams] = useState({});
    const [tagParams, setTagParams] = useState({});

    return (
        <AssociationLayout
            association={association}
            additionalSidebar={
                <>
                    <SidebarSeparator />
                    <SidebarInputSearch setParams={setSearchParams} />
                    <SidebarSpace />
                    <TagSearch
                        setTagParams={setTagParams}
                        tagsQueryParams={{
                            page_size: 1000,
                            namespace__scoped_to_model: "association",
                            namespace__scoped_to_pk: marketplaceId,
                            related_to: "product",
                        }}
                    />
                </>
            }
        >
            <PageTitle>Produits</PageTitle>
            <Pagination
                apiKey={[
                    "products.list",
                    marketplaceId,
                    { page_size: 8, ...tagParams, ...searchParams },
                ]}
                apiMethod={api.products.list}
                render={(products, controlbar) => (
                    <>
                        <Row>
                            {products.map((product) => (
                                <Product
                                    product={product}
                                    key={product.id}
                                    additionalContent={
                                        <Link
                                            to={`/associations/${marketplaceId}/magasin/produits/${product.id}/modifier`}
                                        >
                                            Modifier
                                        </Link>
                                    }
                                />
                            ))}
                        </Row>
                        {controlbar}
                    </>
                )}
            />
        </AssociationLayout>
    );
};
