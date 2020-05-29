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

                <EvaluationSidebar course={course} />

                {/* TODO: Files */}

            </Sidebar>
        );
    }

    return null;
};

const EvaluationSidebar = ({ course }) => {
    const { data: has_voted, error, status } = useBetterQuery<boolean>(
        "courses.has_voted",
        api.courses.has_voted,
        course.id,
    );

    return (
        <SidebarCategory title={"Évaluations"}>

            {status === "error" &&
                <SidebarItem
                    icon="x-circle"
                    to={`/cours/${course.id}`}
                >
                    Error
                </SidebarItem>
            }

            {status === "loading" &&
                <SidebarItem
                    icon="loader"
                    to={`/cours/${course.id}`}
                >
                    Loading
                </SidebarItem>
            }

            {(status === "success" && has_voted) &&
                <SidebarItem
                    icon="pie-chart"
                    to={`/cours/${course.id}/resultats`}
                >
                    Statistiques
            </SidebarItem>
            }

            {(status === "success" && !has_voted) &&
                <SidebarItem
                    icon="edit-3"
                    to={`/cours/${course.id}/evaluer`}
                >
                    Évaluer
                </SidebarItem>
            }

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
                icon={"plus-circle"}
                to={`/cours/${course.id}/formulaires/lier`}
            >
                Lier un formulaire
            </SidebarItem>

            {course.form &&
                <SidebarItem
                    icon={"file-text"}
                    to={`/cours/${course.id}/formulaires/editer`}
                >
                    Modifier le formulaire
                </SidebarItem>
            }
        </SidebarCategory>
    )
}