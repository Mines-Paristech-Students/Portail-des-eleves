import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Event } from "../../models/associations/event";

export const events = {
    list: ({ associationId }) =>
        unwrap<PaginatedResponse<Event[]>>(
            apiService.get(`/associations/events/?association=${associationId}`)
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
        apiService.get(`/associations/events/${eventId}/join/`),
    leave: ({ eventId }) =>
        apiService.get(`/associations/events/${eventId}/leave/`),
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
