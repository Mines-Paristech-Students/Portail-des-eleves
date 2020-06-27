import React, { useContext, useState } from "react";

import { Event } from "../../../../models/associations/event";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { Association } from "../../../../models/associations/association";
import { AvatarList } from "../../../utils/avatar/AvatarList";
import { UserAvatar } from "../../../utils/avatar/UserAvatar";
import { Size } from "../../../../utils/size";
import { Avatar } from "../../../utils/avatar/Avatar";
import { EventCardModal } from "./EventCardModal";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { ToastContext } from "../../../utils/Toast";
import { AxiosError } from "axios";
import { CardStatus } from "../../../utils/CardStatus";
import { TablerColor } from "../../../../utils/colors";
import { EventDate } from "./EventDate";
import { UserContext } from "../../../../services/authService";

/**
 * Display an Event in a Card, as well as a link to join / leave the event.
 * The date, place, name and description of the event are displayed, as well as the participants. One can click on the
 * participants to open `EventCardModel` (which should display more information about the participants).
 * An edit button may be added.
 */
export const EventCard = ({
  association,
  event,
  canEdit = false,
}: {
  association: Association;
  event: Event;
  canEdit?: boolean;
}) => {
  const user = useContext(UserContext);
  const isOver = () => new Date() > event.endsAt;

  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const [showModal, setShowModal] = useState(false);

  const [join] = useMutation(api.events.join, {
    onSuccess: () => {
      queryCache.refetchQueries(["events.list"]);
      sendSuccessToast("Inscription effectuée.");
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;

      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response === undefined
            ? ""
            : "Détails :" + error.response.data.detail
        }`
      );
    },
  });

  const [leave] = useMutation(api.events.leave, {
    onSuccess: () => {
      queryCache.refetchQueries(["events.list"]);
      sendSuccessToast("Désinscription effectuée.");
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;

      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response === undefined
            ? ""
            : "Détails :" + error.response.data.detail
        }`
      );
    },
  });

  return (
    <Card>
      {showModal && (
        <EventCardModal
          event={event}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}

      <CardStatus color={isOver() ? TablerColor.Gray : TablerColor.Blue} />

      <Card.Header>
        <Card.Title>{event.name}</Card.Title>

        <div className="card-options">
          {canEdit && (
            <Link
              to={`/associations/${association.id}/evenements/${event.id}/modifier`}
              className={"btn btn-secondary btn-sm mr-2"}
            >
              Modifier
            </Link>
          )}

          {!isOver() && (
            <>
              {user &&
              event.participants
                .map((participant) => participant.id)
                .includes(user.id) ? (
                <Button
                  className="btn-sm"
                  variant="secondary"
                  onClick={() => leave({ eventId: event.id })}
                >
                  Se désinscrire
                </Button>
              ) : (
                <Button
                  className="btn-sm"
                  variant="primary"
                  onClick={() => join({ eventId: event.id })}
                >
                  S’inscrire
                </Button>
              )}
            </>
          )}
        </div>
      </Card.Header>

      <Card.Body className="pt-3">
        <p className="text-muted mb-2">
          {event.place} | <EventDate event={event} />
        </p>

        {event.participants.length > 0 ? (
          <AvatarList className="mb-4">
            {event.participants.slice(0, 5).map((user) => (
              <UserAvatar
                key={user.id}
                userId={user.id}
                size={Size.Small}
                link={false}
                tooltip={`${user.firstName} ${user.lastName}`}
              />
            ))}
            {event.participants.length > 5 && (
              <Avatar
                size={Size.Small}
                tooltip={"Voir les inscriptions"}
                onClick={() => setShowModal(true)}
                style={{ cursor: "pointer" }}
              >{`+${event.participants.length - 5}`}</Avatar>
            )}
          </AvatarList>
        ) : (
          <p className="text-muted mb-4">
            Pas {isOver() ? "" : "encore "}d’inscription.
          </p>
        )}

        <p>
          {event.description.split("\n").map((item, key) => (
            <React.Fragment key={key}>
              {item}
              <br />
            </React.Fragment>
          ))}
        </p>
      </Card.Body>
    </Card>
  );
};
