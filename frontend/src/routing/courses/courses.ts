import { CourseHome } from "../../components/courses/Home";
import {
    LinkCourseForm,
} from "../../components/courses/forms/Link";
import { EvaluateCourse } from "../../components/courses/evaluations/Evaluate";
import { ResultsCourse } from "../../components/courses/evaluations/Stats";

export const routes = (course) => [
    {
        path: `/`,
        component: CourseHome,
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
