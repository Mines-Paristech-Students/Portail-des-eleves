import { apiService, PaginatedResponse, unwrap, toUrlParams } from "../apiService";
import { Course } from "../../models/courses/course";
import { Comment, StatsQuestion } from "../../models/courses/requests";

import { forms } from "./courseForms";

export const courses = {
    list: () =>
        unwrap<PaginatedResponse<Course[]>>(
            apiService.get(
                '/courses/courses/'
            )
        ),
    get: courseId =>
        unwrap<Course>(
            apiService.get(
                `/courses/courses/${courseId}`
            )
        ),
    save: course => {
        if (!course.id) {
            return unwrap<Course>(
                apiService.post(`/courses/courses/`, course)
            );
        }
        return unwrap<Course>(
            apiService.patch(`/courses/courses/${course.id}/`, course)
        );
    },
    submit: (courseId, data) =>
        apiService.post(
            `/courses/courses/${courseId}/submit`,
            data,
        ),
    has_voted: (courseId) =>
        apiService.get(
            `/courses/courses/${courseId}/has_voted`,
        ).then(res => {
            return res.data.hasVoted;
        }),
    stats: (courseId) =>
        unwrap<StatsQuestion[]>(
            apiService.get(
                `/courses/courses/${courseId}/stats`
            )
        ),
    comments: {
        list: (courseId: number, questionId: number, page: number, page_size: number) => (
            unwrap<PaginatedResponse<Comment[]>>(
                apiService.get(
                    `/courses/comments${toUrlParams({
                        course: courseId,
                        question: questionId,
                        page: page,
                        page_size: page_size,
                    })}`
                )
            )
        ),
    },

    forms: forms,
}