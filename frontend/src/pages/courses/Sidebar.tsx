import React, { useEffect, useState, useContext } from "react";
import { api, useBetterQuery } from "../../services/apiService";
import { Sidebar, SidebarCategory, SidebarItem } from "../../utils/Sidebar";
import { User } from "../../models/user";
import { UserContext } from "../../services/authService";

export const CourseSidebar = ({ course }) => {
    let status = "plop";
    const user: User | null = useContext(UserContext);

    if (status === "loading") {
        return <p>Chargement...</p>;
        // } else if (error) {
        //     return <p>Erreur lors du chargement</p>;
    } else if (course) {
        return (
            <Sidebar title={course.name}>

                {/* {user?.isAdmin && */}
                {true &&
                    <FormSidebar course={course} />
                }

                <EvaluationSidebar />

                {/* TODO: Files */}

            </Sidebar>
        );
    }

    return null;
};

const EvaluationSidebar = () => {

    return (
        <SidebarCategory title={"Évaluations"}>
            <SidebarItem
                icon={"edit-3"}
                to={""}
            >
                Évaluer
            </SidebarItem>
            <SidebarItem
                icon={"pie-chart"}
                to={""}
            >
                Résultats
            </SidebarItem>
        </SidebarCategory>
    )
}

const FormSidebar = ({ course }) => {
    return (
        <SidebarCategory title={"Formulaires"}>
            <SidebarItem
                icon={"file-plus"}
                to={`/cours/${course.id}/formulaires/nouveau`}
            >
                Creer un formulaire
            </SidebarItem>
            <SidebarItem
                icon={"file-plus"}
                to={"/cours/formulaires"}
            >
                Modifier un formulaire
            </SidebarItem>
            <SidebarItem
                icon={"plus-circle"}
                to={"edit-3"}
            >
                Lier un formulaire
            </SidebarItem>
        </SidebarCategory>
    )
}