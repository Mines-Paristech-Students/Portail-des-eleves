import React from "react";
import { AssociationLayout } from "../../Layout";
import { Association } from "../../../../models/associations/association";
import Container from "react-bootstrap/Container";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import Row from "react-bootstrap/Row";
import { LoanableCard } from "./LoanableCard";
import Col from "react-bootstrap/Col";
import { PageTitle } from "../../../utils/PageTitle";

export const AssociationLibraryHome = ({
    association,
}: {
    association: Association;
}) => {
    return (
        <AssociationLayout association={association}>
            <Container>
                <PageTitle>Bibliothèque</PageTitle>

                <Pagination
                    apiMethod={api.loanables.list}
                    apiKey={[
                        "loanables.list",
                        { library__id: association.id, page_size: 10 },
                    ]}
                    paginationControlProps={{
                        className: "justify-content-center mb-5",
                    }}
                    render={(loanables, paginationControl) => (
                        <>
                            <Row>
                                {loanables.map((loanable) => (
                                    <Col key={loanable.id} xs={12} lg={6}>
                                        <LoanableCard loanable={loanable} />
                                    </Col>
                                ))}
                            </Row>
                            {paginationControl}
                        </>
                    )}
                />
            </Container>
        </AssociationLayout>
    );
};
