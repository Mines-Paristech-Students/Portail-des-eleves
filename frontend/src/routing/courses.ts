import { CourseHome } from "../pages/courses/Home";
import { EditCourseForm, CreateCourseForm } from "../pages/courses/forms/Edit";
import { EvaluateCourse } from "../pages/courses/evaluations/Evaluate";

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
        path: `/formulaires/:courseId/éditer`,
        component: EditCourseForm,
        exact: true,
        props: { course : course }
    },
    {
        path: `/evaluer`,
        component: EvaluateCourse,
        exact: true,
        props: { course : course }
    },
];
