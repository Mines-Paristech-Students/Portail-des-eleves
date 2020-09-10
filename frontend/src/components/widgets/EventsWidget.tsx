import { api, useBetterQuery } from "../../services/apiService";
import { Widget } from "./Widget";
import { TablerColor } from "../../utils/colors";
import { useWidgetConfig } from "./widgetConfig";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import React, { useContext, useState } from "react";
import "./widget_balance.css";
import { Event } from "../../models/associations/event";
import { formatDate, formatTime } from "../../utils/format";
import dayjs  from "dayjs";
import { Modal } from "react-bootstrap";
import { AvatarList } from "../utils/avatar/AvatarList";
import { EventDate } from "../associations/events/list/EventDate";
import { UserAvatar } from "../utils/avatar/UserAvatar";
import { Size } from "../../utils/size";
import { UserContext } from "../../services/authService";

export const EventWidget = ({ ...props }) => {
  const { data, error, status } = useBetterQuery<Event[]>(
    ["subscriptions.events.get"],
    api.subscriptions.events,
    { refetchOnWindowFocus: false }
  );

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <>
      <Widget
        name={"Evenements à venir"}
        color={TablerColor.Purple}
        bodyWrapped={false}
        {...useWidgetConfig("events")}
        {...props}
      >
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
        ) : status === "success" && data ? (
          <>
            <table className="table card-table border-top table-borderless mb-2">
              <tbody>
                <GroupEvents
                  events={data}
                  setSelectedEvent={setSelectedEvent}
                />
              </tbody>
            </table>
            {data.length === 0 && <p>Aucun évenement à venir</p>}
          </>
        ) : null}
      </Widget>
      <EventModal event={selectedEvent} setEvent={setSelectedEvent} />
    </>
  );
};

const GroupEvents = ({ events, setSelectedEvent }) => {
  const user = useContext(UserContext);

  return events.reduce(
    ({ body, currentDate }, event) => {
      console.log(body, currentDate, event);
      let eventDate = dayjs(event.startsAt).date();
      let res = (
        <>
          {eventDate !== currentDate && (
            <tr className={"border-0"}>
              <td colSpan={2}>
                <strong>
                  {currentDate === dayjs().date()
                    ? "Aujourd'hui"
                    : dayjs(event.startsAt).date() ===
                      dayjs().add(1, "day").date()
                    ? "Demain"
                    : "Le " + formatDate(event.startsAt)}
                </strong>
              </td>
            </tr>
          )}
          <tr className={"border-0"}>
            <td className={"py-0 align-middle"}>
              <img
                src={event.association.logo}
                width={32}
                alt={`Logo de ${event.association.name}`}
              />{" "}
              <button
                className={"btn btn-link"}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedEvent(event);
                }}
              >
                {event.name}
              </button>
            </td>
            <td className="py-0 text-right text-muted">
              {event.participants.some(
                (participant) => participant.id === user?.id
              ) && <span className="tag tag-green mr-2">Inscrit</span>}
              {formatTime(event.startsAt)}
            </td>
          </tr>
        </>
      );
      return { body: [...body, res], currentDate: eventDate };
    },
    { body: [], currentDate: null }
  ).body;
};

const EventModal = ({ event, setEvent }) => {
  const user = useContext(UserContext);

  return event != null ? (
    <Modal show={true} onHide={() => setEvent(null)}>
      <Modal.Body>
        <h1>
          {event.name}{" "}
          {event.participants.some(
            (participant) => participant.id === user?.id
          ) && <span className="tag tag-green align-middle">Inscrit</span>}
        </h1>
        <p className="text-muted mb-2">
          {event.place} | <EventDate event={event} />
        </p>

        <AvatarList className="mb-4">
          {event.participants.map((user) => (
            <UserAvatar
              key={user.id}
              userId={user.id}
              size={Size.Medium}
              link={false}
              tooltip={`${user.firstName} ${user.lastName}`}
            />
          ))}
        </AvatarList>

        <p>
          {event.description.split("\n").map((item, key) => (
            <React.Fragment key={key}>
              {item}
              <br />
            </React.Fragment>
          ))}
        </p>
      </Modal.Body>
    </Modal>
  ) : null;
};
