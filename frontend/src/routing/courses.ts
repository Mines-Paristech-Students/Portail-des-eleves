
import { CourseHome } from "../pages/courses/Home";

export const routes = course => [
    {
        path: `/`,
        component: CourseHome,
        exact: true,
        props: { course : course }
    },
];
