import {
    apiService,
    PaginatedResponse,
    unwrap,
    toUrlParams,
} from "../apiService";
import { Event } from "../../models/associations/event";

export const events = {
    list: (
        parameters: {
            association: string;
            time?: ("NOW" | "BEFORE" | "AFTER")[];
        },
        page: number
    ) =>
        unwrap<PaginatedResponse<Event[]>>(
            apiService.get(
                `/associations/events/${toUrlParams({
                    ...parameters,
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
