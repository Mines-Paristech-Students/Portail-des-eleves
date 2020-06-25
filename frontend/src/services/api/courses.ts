import {
    apiService,
    PaginatedResponse,
    unwrap,
} from "../apiService";
import { toUrlParams } from "../../utils/urlParam";
import { Course } from "../../models/courses/course";
import { Comment, StatsQuestion } from "../../models/courses/requests";
import { Submission } from "../../models/courses/submission";

import { forms } from "./courseForms";

export const courses = {
    list: () =>
        unwrap<PaginatedResponse<Course[]>>(
            apiService.get("/courses/courses/")
        ),
    get: (courseId: number) =>
        unwrap<Course>(apiService.get(`/courses/courses/${courseId}`)),
    save: (course: Course) =>
        course.id
            ? unwrap<Course>(apiService.post(`/courses/courses/`, course))
            : unwrap<Course>(
                  apiService.patch(`/courses/courses/${course.id}/`, course)
              ),
    submit: (courseId: number, data: Submission) =>
        apiService.post(`/courses/courses/${courseId}/submit`, data),
    has_voted: (courseId: number) =>
        apiService.get(`/courses/courses/${courseId}/has_voted`).then((res) => {
            return res.data.hasVoted;
        }),
    stats: (courseId: number) =>
        unwrap<StatsQuestion[]>(
            apiService.get(`/courses/courses/${courseId}/stats`)
        ),
    comments: {
        list: (
            courseId: number,
            questionId: number,
            page: number,
            page_size: number
        ) =>
            unwrap<PaginatedResponse<Comment[]>>(
                apiService.get(
                    `/courses/comments${toUrlParams({
                        course: courseId,
                        question: questionId,
                        page: page,
                        page_size: page_size,
                    })}`
                )
            ),
    },

    forms: forms,
};
