import React from "react";
import Container from "react-bootstrap/Container";
import { Loading } from "../utils/Loading";
import { api, useBetterPaginatedQuery } from "../../services/apiService";
import { ErrorMessage } from "../utils/ErrorPage";
import { Instructions } from "../utils/Instructions";
import { Link } from "react-router-dom";
import { AssociationPageCard } from "./page/show/AssociationPageCard";

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
            <Instructions
                title={"Accueil"}
                emoji={"🏡"}
                emojiAriaLabel="Une sympathique demeure au jardin accueillant"
            >
                {association.myRole.permissions?.includes("page") ? (
                    <>
                        Pour définir une page d'accueil,{" "}
                        <Link
                            to={`/associations/${association.id}/pages/nouvelle`}
                        >
                            créez une page
                        </Link>{" "}
                        appelée « Accueil ».
                        <br />
                        C'est aussi simple que ça !
                    </>
                ) : (
                    "Rien à voir ici pour le moment mais vous pouvez accéder aux différentes rubriques grâce à la barre de navigation à gauche."
                )}
            </Instructions>
        </Container>
    ) : (
        <AssociationPageCard association={association} page={data.results[0]} />
    );
};
