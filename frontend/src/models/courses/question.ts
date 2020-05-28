export enum QuestionCategory {
    Comment = "C",
    Rating = "R",
}

export interface Question {
    id?: number;
    label: string;
    required: boolean;
    archived: boolean;
    category: QuestionCategory;
    form: number;
}