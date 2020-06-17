import React from "react";
import Container from "react-bootstrap/Container";

export const Error = ({ detail }: { detail?: any }) => (
  <Container>
    <p>
      Erreur. Merci de réessayer ou de contacter les administrateurs.
      <br />
      Détails: {detail}
    </p>
  </Container>
);
