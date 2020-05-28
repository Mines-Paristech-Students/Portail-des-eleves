interface Histogram {
    [keys: number]: number;
}

export interface StatsQuestion {
    id: number;
    label: string;
    average: number;
    histogram: Histogram;
}

interface Comment {
    id: number;
    course: number;
    question: number;
    content: string;
}

interface CommentsList {
    [keys: number]: Comment;
}

export interface CommentsPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: 
}