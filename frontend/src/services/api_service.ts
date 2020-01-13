export enum APIServiceStatus {
    Loading = "Loading",
    Loaded = "Loaded",
    Error = "Error"
}

interface APIServiceLoading {
    status: APIServiceStatus.Loading;
}

interface APIServiceLoaded<T> {
    status: APIServiceStatus.Loaded;
    payload: T;
}

interface APIServiceError {
    status: APIServiceStatus.Error;
    error: Error;
}

export type APIService<T> =
    | APIServiceLoading
    | APIServiceLoaded<T>
    | APIServiceError;

export const baseEndpoint = "http://localhost:8000/api/v1";
