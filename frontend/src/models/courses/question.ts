export enum QuestionCategory {
    Comment = "C",
    Rating = "R",
}

export interface Question {
    id?: number;
    category: QuestionCategory;
    label: string;
    required: boolean;
    archived: boolean;
    form: number;
}
