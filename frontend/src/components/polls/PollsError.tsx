import React from "react";
import Container from "react-bootstrap/Container";

export const PollsError = ({ detail }: { detail?: any }) =>
    <Container>
        <p>
            Erreur de chargement. Merci de réessayer ou de contacter les administrateurs.<br/>
            Détails: {detail}
        </p>;
    </Container>;
