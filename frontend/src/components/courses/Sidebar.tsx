import React, { useContext } from "react";
import { api, useBetterQuery } from "../../services/apiService";
import { Sidebar, SidebarCategory, SidebarItem } from "../../utils/Sidebar";
import { Loading } from "../utils/Loading";
import { UserContext } from "../../services/authService";

export const CourseSidebar = ({ course }) => {
    const user = useContext(UserContext);

    return (
        <Sidebar title={course.name}>
            {user?.isStaff && <FormSidebar course={course} />}

            <EvaluationSidebar course={course} />

            {/* TODO: Files */}
        </Sidebar>
    );
};

const EvaluationSidebar = ({ course }) => {
    const { data: has_voted, error, status } = useBetterQuery<boolean>(
        ["courses.has_voted", course.id],
        api.courses.has_voted
    );

    return (
        <SidebarCategory title={"Évaluations"}>
            {status === "error" && (
                <SidebarItem icon="x-circle" to={`/cours/${course.id}`}>
                    {`${error}`}
                </SidebarItem>
            )}

            {status === "loading" && (
                <SidebarItem icon="loader" to={`/cours/${course.id}`}>
                    <Loading />
                </SidebarItem>
            )}

            {status === "success" && has_voted && (
                <SidebarItem
                    icon="pie-chart"
                    to={`/cours/${course.id}/resultats`}
                >
                    Statistiques
                </SidebarItem>
            )}

            {status === "success" && !has_voted && (
                <SidebarItem icon="edit-3" to={`/cours/${course.id}/evaluer`}>
                    Évaluer
                </SidebarItem>
            )}
        </SidebarCategory>
    );
};

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

            {course.form && (
                <SidebarItem
                    icon={"file-text"}
                    to={`/cours/${course.id}/formulaires/editer`}
                >
                    Modifier le formulaire
                </SidebarItem>
            )}
        </SidebarCategory>
    );
};
