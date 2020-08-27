import { Widget } from "./Widget";
import { useWidgetConfig } from "./widgetConfig";
import React from "react";
import { api, useBetterQuery } from "../../services/apiService";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { UserAvatar } from "../utils/avatar/UserAvatar"; // import locale
import { Row } from "react-bootstrap";

export const BirthdayWidget = ({ ...props }) => {
  const { data, error, status } = useBetterQuery<any>(
    ["subsriptions.birthday.get"],
    api.subscriptions.birthdays
  );

  return (
    <Widget
      name={"Anniversaires à venir"}
      {...useWidgetConfig("birthday")}
      {...props}
    >
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
      ) : status === "success" && data ? (
        data.map(({ day, month, users }) => (
          <div key={day + "-" + month} className={"mb-4"}>
            <h4>
              {dayjs()
                .set("month", month)
                .set("day", day)
                .locale("fr")
                .format("dddd DD MMMM")}
            </h4>
            <Row>
              {users.map((user) => (
                <div className="row col-auto align-items-center py-2" key={user.id}>
                  <div className="col-auto pr-0">
                    <UserAvatar
                      key={user.id}
                      userId={user.id}
                      tooltip={`${user.firstName} ${user.lastName}`}
                    />
                  </div>
                  <div className="col pl-1">
                    <div>
                      <a href="#" className="text-inherit">
                        {user.id}
                      </a>
                    </div>
                    <small className="d-block item-except text-sm text-muted h-1x">
                      XXX ans
                    </small>
                  </div>
                </div>
              ))}
            </Row>
          </div>
        ))
      ) : null}
    </Widget>
  );
};
