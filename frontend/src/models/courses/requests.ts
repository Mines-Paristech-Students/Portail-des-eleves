export interface Histogram {
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
