import { FormList } from "../../components/courses/forms/List";
import { EditCourseForm } from "../../components/courses/forms/Edit";
import { CreateCourseForm } from "../../components/courses/forms/Create";

export const routes = () => [
  {
    path: `/`,
    component: FormList,
    exact: true,
  },
  {
    path: `/:formId/editer`,
    component: EditCourseForm,
    exact: true,
  },
  {
    path: `/nouveau`,
    component: CreateCourseForm,
    exact: false,
  },
];
