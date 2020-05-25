import { CourseHome } from "../pages/courses/Home";
import { EditCourseForm } from "../pages/courses/forms/Edit";
import { CreateCourseForm, LinkCourseForm } from "../pages/courses/forms/Link";
import { EvaluateCourse } from "../pages/courses/evaluations/Evaluate";
import { StatsCourse } from "../pages/courses/evaluations/Stats";
import { Link } from "react-bootstrap/lib/Navbar";

export const routes = course => [
    {
        path: `/`,
        component: CourseHome,
        exact: true,
        props: { course : course }
    },
    {
        path: `/formulaires/nouveau`,
        component: CreateCourseForm,
        exact: true,
        props: { course : course }
    },
    {
        path: `/formulaires/editer`,
        component: EditCourseForm,
        exact: true,
        props: { course : course }
    },
    {
        path: `/formulaires/lier`,
        component: LinkCourseForm,
        exact: true,
        props: { course : course }
    },
    {
        path: `/evaluer`,
        component: EvaluateCourse,
        exact: true,
        props: { course : course }
    },
    {
        path: `/stats`,
        component: StatsCourse,
        exact: true,
        props: { course : course }
    },
];
