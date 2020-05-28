interface Histogram {
    [keys: number]: number;
}

export interface StatsQuestion {
    id: number;
    label: string;
    average: number;
    histogram: Histogram;
}

export interface Comment {
    id: number;
    course: number;
    question: number;
    content: string;
}

export interface CommentsPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Comment[];
}