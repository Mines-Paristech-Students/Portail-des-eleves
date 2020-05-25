interface Histogram {
    [keys: number]: number;
}

export interface StatsQuestion {
    id: number;
    label: string;
    average: number;
    histogram: Histogram;
}