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
        unwrap<Event>(apiService.get(`/associations/events/${eventId}/`)).then(
            (event) => {
                event.startsAt = new Date(event.startsAt);
                event.endsAt = new Date(event.endsAt);
                return event;
            }
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
        apiService.post(`/associations/events/`, {
            ...data,
            startsAt: dayjs(data.startsAt).format("YYYY-MM-DDTHH:mm:ss"),
            endsAt: dayjs(data.endsAt).format("YYYY-MM-DDTHH:mm:ss"),
        }),
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
