import React from "react";
import { PageTitle } from "../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { Loading } from "../utils/Loading";
import { api, useBetterPaginatedQuery } from "../../services/apiService";
import { ErrorMessage } from "../utils/ErrorPage";
import { AssociationPageRenderer } from "./page/Show";

export const AssociationHome = ({ association }) => {
    const { resolvedData: data, error, status } = useBetterPaginatedQuery<any>(
        [
            "association.page.list.homepage",
            association.id,
            { title: "Accueil" },
        ],
        api.pages.list
    );

    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>{error}</ErrorMessage>
    ) : data.count === 0 ? (
        <Container className={"text-center"}>
            <p style={{ fontSize: "10em" }} className={"m-0"}>
                🏡
            </p>
            <h1>
                Accueil <br />
                <br />
                <small className="text-muted">
                    Pour définir une page d'accueil, créez une page appellée
                    « Accueil ». C'est aussi simple que ça !
                </small>
            </h1>
        </Container>
    ) : (
        <AssociationPageRenderer
            association={association}
            page={data.results[0]}
        />
    );
};
