import {
    apiService,
    PaginatedResponse,
    unwrap,
    toUrlParams,
} from "../apiService";
import { Event } from "../../models/associations/event";
import dayjs from "dayjs";

export type EventsListParameters = {
    association: string;
    time?: ("NOW" | "BEFORE" | "AFTER")[];
    starts_at_before?: Date;
    starts_at_after?: Date;
    ends_at_before?: Date;
    ends_at_after?: Date;
    ordering?: "starts_at" | "-starts_at";
};

export const events = {
    list: (parameters: EventsListParameters, page: number) =>
        unwrap<PaginatedResponse<Event[]>>(
            apiService.get(
                `/associations/events/${toUrlParams({
                    ...parameters,
                    starts_at_before: parameters.starts_at_before
                        ? dayjs(parameters.starts_at_before).format(
                              "YYYY-MM-DD%20HH:mm:ss"
                          )
                        : undefined,
                    starts_at_after: parameters.starts_at_after
                        ? dayjs(parameters.starts_at_after).format(
                              "YYYY-MM-DD%20HH:mm:ss"
                          )
                        : undefined,
                    ends_at_before: parameters.ends_at_before
                        ? dayjs(parameters.ends_at_before).format(
                              "YYYY-MM-DD%20HH:mm:ss"
                          )
                        : undefined,
                    ends_at_after: parameters.ends_at_after
                        ? dayjs(parameters.ends_at_after).format(
                              "YYYY-MM-DD%20HH:mm:ss"
                          )
                        : undefined,
                    page: page,
                    page_size: 10,
                })}`
            )
        ).then((data) => {
            data.results.forEach((event) => {
                event.startsAt = new Date(event.startsAt);
                event.endsAt = new Date(event.endsAt);
            });
            return data;
        }),
    get: ({ eventId }) =>
        unwrap<Event>(apiService.get(`/associations/events/${eventId}/`)).then(
            (event) => ({
                ...event,
                startsAt: new Date(event.startsAt),
                endsAt: new Date(event.endsAt),
            })
        ),
    join: ({ eventId }) =>
        apiService.put(`/associations/events/${eventId}/join/`),
    leave: ({ eventId }) =>
        apiService.put(`/associations/events/${eventId}/leave/`),
    create: ({
        data,
    }: {
        data: {
            association: string;
            name: string;
            description: string;
            startsAt: Date;
            endsAt: Date;
            place: string;
        };
    }) =>
        apiService.post(`/associations/events/`, data),
    update: ({
        eventId,
        data,
    }: {
        eventId: string;
        data: {
            name: string;
            description: string;
            startsAt: Date;
            endsAt: Date;
            place: string;
        };
    }) => apiService.patch(`/associations/events/${eventId}/`, data),
    delete: ({ eventId }: { eventId: string }) =>
        apiService.delete(`/associations/events/${eventId}/`),
};
