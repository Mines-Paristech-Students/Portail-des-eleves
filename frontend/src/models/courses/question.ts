import { Form } from "./form"

export interface Question {
    id: number;
    label: string;
    required: boolean;
    archived: boolean;
    category: string;
    form: Form;
}