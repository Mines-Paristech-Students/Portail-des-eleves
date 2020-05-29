import {
    apiService,
    PaginatedResponse,
    unwrap,
    toUrlParams,
} from "../apiService";
import { Event } from "../../models/associations/event";
import dayjs from "dayjs";

export const events = {
    list: (
        parameters: {
            association: string;
            time: ("NOW" | "BEFORE" | "AFTER")[];
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
        apiService.post(`/associations/events/`, {
            ...data,
            startsAt: dayjs(data.startsAt).format("YYYY-MM-DDTHH:mm:ss"),
            endsAt: dayjs(data.endsAt).format("YYYY-MM-DDTHH:mm:ss"),
        }),
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
