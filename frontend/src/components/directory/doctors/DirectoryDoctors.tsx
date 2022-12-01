import React from "react";
import { DirectoryLayout } from "../DirectoryLayout";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";

export const DirectoryDoctors = () => (
  <DirectoryLayout>
    <Container>
      <div className="d-flex align-items-center">
        <PageTitle>Médecins</PageTitle>
      </div>
    </Container>
  </DirectoryLayout>
);
