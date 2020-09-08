import { api, useBetterQuery } from "../../services/apiService";
import { Widget } from "./Widget";
import { TablerColor } from "../../utils/colors";
import { useWidgetConfig } from "./widgetConfig";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import React, { useState } from "react";
import { Poll } from "../../models/polls";
import { PollVotingForm } from "../polls/list/PollVotingForm";
import { PollResults } from "../polls/list/PollResults";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { PollNoPolls } from "../polls/list/PollNoPolls";

export const PollWidget = ({ ...props }) => {
  const [date, setDate] = useState(dayjs());
  const dateIsToday =
    date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

  const { data, error, status } = useBetterQuery<Poll[]>(
    ["subsriptions.polls.get", { date: date.format("YYYY-MM-DD") }],
    api.subscriptions.polls,
    { refetchOnWindowFocus: false }
  );

  const navigationButtons = (
    <>
      <span
        className={"float-left"}
        onClick={() => setDate(date.add(-1, "day"))}
      >
        <i className="fe fe-arrow-left" />
      </span>
      {!dateIsToday && (
        <span
          className={"float-right"}
          onClick={() => setDate(date.add(+1, "day"))}
        >
          <i className="fe fe-arrow-right" />
        </span>
      )}
    </>
  );

  return (
    <Widget
      name={"Sondage du jour"}
      color={TablerColor.Blue}
      {...useWidgetConfig("polls")}
      {...props}
    >
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
      ) : status === "success" && data ? (
        <>
          {data.map((poll) =>
            poll.userHasVoted || !poll.isActive ? (
              <PollResults poll={poll}>{navigationButtons}</PollResults>
            ) : (
              <PollVotingForm poll={poll}>{navigationButtons}</PollVotingForm>
            )
          )}
          {data.length === 0 &&
            (dateIsToday ? (
              <>
                <PollNoPolls />
                {navigationButtons}
              </>
            ) : (
              <>
                {navigationButtons}
                <p>
                  Pas de sondage le {date.locale("fr").format("dddd DD MMMM")}
                </p>
              </>
            ))}
        </>
      ) : null}
    </Widget>
  );
};
