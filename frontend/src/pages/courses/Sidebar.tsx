import React from "react";
import { api, useBetterQuery } from "../../services/apiService";
import {Sidebar, SidebarCategory, SidebarItem} from "../../utils/Sidebar";

export const CourseSidebar = ({ course }) => {
    let status = "plop";
    if (status === "loading") {
        return <p>Chargement...</p>;
    // } else if (error) {
    //     return <p>Erreur lors du chargement</p>;
    } else if (course) {
        return (
            <Sidebar title={course.name}>

                <SidebarCategory title={"Évaluations"}>
                </SidebarCategory>
                {/* <SidebarCategory title={"Pages"}>
                    <ListPagesItem course={course} pages={pages} />
                    <AddPageItem course={course} />
                </SidebarCategory> */}

            </Sidebar>
        );
    }

    return null;
};