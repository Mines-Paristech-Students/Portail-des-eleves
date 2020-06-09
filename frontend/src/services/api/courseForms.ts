import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Question } from "../../models/courses/question";
import { Form } from "../../models/courses/form";

export const forms = {
    get: (formId: number) =>
        unwrap<Form>(apiService.get(`/courses/forms/${formId}`)),
    list: () =>
        unwrap<PaginatedResponse<Form[]>>(apiService.get(`/courses/forms/`)),
    save: (form: Form) => {
        return form.id
            ? unwrap<Form>(apiService.patch(`/courses/forms/${form.id}/`, form))
            : unwrap<Form>(apiService.post(`/courses/forms/`, form));
    },

    questions: {
        save: (question: Question) => {
            return question.id
                ? unwrap<Question>(
                      apiService.patch(
                          `/courses/questions/${question.id}/`,
                          question
                      )
                  )
                : unwrap<Question>(
                      apiService.post(`/courses/questions/`, question)
                  );
        },
        list: (id: number) =>
            unwrap<Question[]>(apiService.get(`courses/forms/${id}/questions`)),
    },
};
