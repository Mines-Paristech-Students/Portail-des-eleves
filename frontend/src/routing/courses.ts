import { CourseHome } from "../components/courses/Home";
import { FormList } from "../components/courses/List";
import { EditCourseForm } from "../components/courses/forms/Edit";
import {
    CreateCourseForm,
    LinkCourseForm,
} from "../components/courses/forms/Link";
import { EvaluateCourse } from "../components/courses/evaluations/Evaluate";
import { ResultsCourse } from "../components/courses/evaluations/Stats";

export const routes = (course) => [
    {
        path: `/`,
        component: CourseHome,
        exact: true,
        props: { course: course },
    },
    {
        path: `/formulaires/nouveau`,
        component: CreateCourseForm,
        exact: true,
        props: { course: course },
    },
    {
        path: `/formulaires/editer`,
        component: EditCourseForm,
        exact: true,
        props: { course: course },
    },
    {
        path: `/formulaires/lier`,
        component: LinkCourseForm,
        exact: true,
        props: { course: course },
    },
    {
        path: `/evaluer`,
        component: EvaluateCourse,
        exact: true,
        props: { course: course },
    },
    {
        path: `/resultats`,
        component: ResultsCourse,
        exact: true,
        props: { course: course },
    },
];
