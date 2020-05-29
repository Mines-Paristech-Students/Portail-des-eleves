import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Course } from "../../models/courses/course";
import { Question } from "../../models/courses/question";
import { Form } from "../../models/courses/form";
import { Comment, StatsQuestion } from "../../models/courses/requests";


export const forms = {
    get: (formId: number) =>
        unwrap<Form>(
            apiService.get(
                `/courses/forms/${formId}`
            )
        ),
    list: () =>
        unwrap<Form[]>(
            apiService.get(
                `/courses/forms`
            )
        ),
    save: (form: Form) => {
        if (form.id)
            return (
                unwrap<Form>(
                    apiService.patch(
                        `/courses/forms/${form.id}/`,
                        form,
                    )
                )
            )
        return (
            unwrap<Form>(
                apiService.post(
                    `/courses/forms/`,
                    form,
                )
            )
        )
    },

    questions: {
        save: (question: Question) => {
            console.log("Begore " + question.form)
            if (!question.id) {
                return unwrap<Question>(
                    apiService.post(`/courses/questions/`, question)
                );
            }

            return unwrap<Question>(
                apiService.patch(`/courses/questions/${question.id}/`, question)
            );
        },
        list: (id: number) =>
            unwrap<Question[]>(
                apiService.get(
                    `courses/forms/${id}/questions`,
                )
            ),
    }
},