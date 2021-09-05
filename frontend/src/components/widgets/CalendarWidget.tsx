import { api, useBetterQuery } from "../../services/apiService";
import { Widget } from "./Widget";
import { TablerColor } from "../../utils/colors";
import { useWidgetConfig } from "./widgetConfig";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import React from "react";
import { Event } from "../../models/associations/event";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl } from "../../services/apiService";

export const CalendarWidget = ({ ...props }) => {
  const { data, error, status } = useBetterQuery<any>(
    ["subscriptions.calendar.get"],
    api.subscriptions.calendar,
    { refetchOnWindowFocus: false }
  );

  return (
    <Widget
      name={"Evènements à venir"}
      color={TablerColor.Red}
      bodyWrapped={false}
      {...useWidgetConfig("calendar")}
      {...props}
    >
      <Card.Body>
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
      ) : status === "success" && data && Object.keys(data).length ? (
        Object.keys(data).map((key) => {
            // Starts at Date
            let [year, month, day] = key.split('_');
            
            return (
              <div key={year + "-" + day + "-" + month} className={"mb-4"}>
                <h4>
                  {dayjs()
                    .set("year", parseInt(year))
                    .set("month", parseInt(month) - 1) // January = 0
                    .set("date", parseInt(day))
                    .locale("fr")
                    .format("dddd DD MMMM")}
                </h4>
                <Row>
                  { data[key].map((event: Event) => {
                    let startsAt = new Date(event.startsAt);
                    let endsAt = new Date(event.endsAt);

                    return (
                      <div
                        className="align-items-center py-2 px-0 w-100"
                        key={event.id}
                      >
                        <Link to={`/associations/${event.association.id}`} className="float-left pr-2">
                          <span
                            className="avatar avatar-lg avatar-white"
                            style={{
                              boxShadow: "0 2px 4px 0 hsla(0, 0%, 0%, 0.2)",
                              backgroundImage: event.association.logo ? `url(${baseUrl + event.association.logo})` : "",
                            }}
                          ></span>
                        </Link>
                        <div>
                          <Link to={`/associations/${event.association.id}/evenements`} className="text-inherit">
                            {event.name}
                          </Link>
                          <br/>
                          <span className="text-muted h-1x">
                            {`${startsAt.getHours()}:${startsAt.getMinutes()} > ${dayjs()
                                .set("year", endsAt.getFullYear())
                                .set("month", endsAt.getMonth())
                                .set("date", endsAt.getDate())
                                .locale("fr")
                                .format("dddd DD MMMM")} ${endsAt.getHours()}:${endsAt.getMinutes()}`}
                          </span>
                        </div>
                      </div>
                  )}) }
                </Row>
              </div>
            );
          })
      ) : "Aucun évènement à venir dans les 2 prochaines semaines :(" }
      </Card.Body>
    </Widget>
  );
};
