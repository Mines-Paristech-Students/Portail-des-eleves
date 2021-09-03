import { api, useBetterQuery } from "../../services/apiService";
import { Widget } from "./Widget";
import { TablerColor } from "../../utils/colors";
import { useWidgetConfig } from "./widgetConfig";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import React from "react";
import { formatPrice } from "../../utils/format";
import { Event } from "../../models/associations/event";

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
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
      ) : status === "success" && data ? (
        <table className="table card-table border-top">
            <tbody>
                {data.length ? 
                    data.map((event: Event) => (
                        <tr>
                          <td>{/*event.association.name*/}</td>
                          <td className="text-right">
                            {/*event.name*/}
                          </td>
                        </tr>
                      )) 
                : "Aucun évènement à venir dans les 2 prochaines semaines :("}
            </tbody>
        </table>
      ) : null}
    </Widget>
  );
};
