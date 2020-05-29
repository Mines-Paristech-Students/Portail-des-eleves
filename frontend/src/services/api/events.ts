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
    time: ("NOW" | "BEFORE" | "AFTER")[];
    starts_at_before?: Date;
    starts_at_after?: Date;
    ends_at_before?: Date;
    ends_at_after?: Date;
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
        unwrap<Event>(apiService.get(`/associations/events/${eventId}`)),
    join: ({ eventId }) =>
        apiService.put(`/associations/events/${eventId}/join/`),
    leave: ({ eventId }) =>
        apiService.put(`/associations/events/${eventId}/leave/`),
    save: (event) => {
        if (!event.id) {
            return unwrap<Event>(
                apiService.post(`/associations/events/`, event)
            );
        }

        return unwrap<Event>(
            apiService.patch(`/associations/events/${event.id}/`, event)
        );
    },
    delete: (event) => {
        return unwrap<Event>(
            apiService.delete(`/associations/events/${event.id}/`)
        );
    },
};
