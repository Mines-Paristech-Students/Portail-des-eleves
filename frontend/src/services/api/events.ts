import { apiService, unwrap } from "../apiService";

export const events = {
    list: ({ associationId }) =>
        unwrap<Event[]>(
            apiService.get(`/associations/events/?association=${associationId}`)
        ),
    get: ({ eventId }) =>
        unwrap<Event>(apiService.get(`/associations/events/${eventId}`)),
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
