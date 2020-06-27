import React, { useContext } from "react";
import { api, useBetterQuery } from "../../services/apiService";
import { Sidebar, SidebarItem } from "../../utils/Sidebar";
import { Loading } from "../utils/Loading";
import { UserContext } from "../../services/authService";
import { SidebarSpace, SidebarSeparator } from "../utils/sidebar/Sidebar";
import { useLocation, useParams } from "react-router-dom";

export const MainSidebar = () => {
  const location = useLocation();
  const { courseId } = useParams();

  return (
    <Sidebar title="Cours">
      <SidebarItem icon={"book"} to={"/cours/"}>
        Cours
      </SidebarItem>

      <SidebarItem icon={"edit-3"} to={"/cours/formulaires"}>
        Formulaires
      </SidebarItem>

      {courseId && <CourseSidebar courseId={courseId} />}

      {location.pathname.startsWith("/cours/formulaires") && <FormSidebar />}
    </Sidebar>
  );
};

const CourseSidebar = ({ courseId }) => {
  return (
    <>
      <SidebarSeparator />
      <EvaluationSidebar courseId={courseId} />

      <SidebarSpace />

      <SidebarItem
        icon={"plus-circle"}
        to={`/cours/${courseId}/formulaires/lier`}
      >
        Lier un formulaire
      </SidebarItem>
    </>
  );
};

const EvaluationSidebar = ({ courseId }) => {
  const { data: has_voted, error, status } = useBetterQuery<boolean>(
    ["courses.has_voted", courseId],
    api.courses.has_voted
  );

  return (
    <>
      {status === "error" && (
        <SidebarItem icon="x-circle" to={`/cours/${courseId}`}>
          {`${error}`}
        </SidebarItem>
      )}

      {status === "loading" && (
        <SidebarItem icon="loader" to={`/cours/${courseId}`}>
          <Loading />
        </SidebarItem>
      )}

      {status === "success" && has_voted && (
        <SidebarItem icon="pie-chart" to={`/cours/${courseId}/resultats`}>
          Statistiques
        </SidebarItem>
      )}

      {status === "success" && !has_voted && (
        <SidebarItem icon="edit-3" to={`/cours/${courseId}/evaluer`}>
          Évaluer
        </SidebarItem>
      )}
    </>
  );
};

const FormSidebar = () => {
  const user = useContext(UserContext);

  return user?.isStaff ? (
    <>
      <SidebarSeparator />
      <SidebarItem icon={"file-plus"} to={`/cours/formulaires/nouveau`}>
        Creer un formulaire
      </SidebarItem>
    </>
  ) : null;
};
