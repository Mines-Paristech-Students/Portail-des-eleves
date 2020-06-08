export interface EvalData {
    ratings: { [key: number]: number };
    comments: { [key: number]: string };
}

export interface CommentSubmission {
    question: number;
    content: string;
}

export interface RatingSubmission {
    question: number;
    value: number;
}

export interface Submission {
    course: number;
    ratings: RatingSubmission[];
    comments: CommentSubmission[];
}
