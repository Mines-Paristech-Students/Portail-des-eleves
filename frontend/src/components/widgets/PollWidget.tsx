import { api, useBetterQuery } from "../../services/apiService";
import { Widget } from "./Widget";
import { TablerColor } from "../../utils/colors";
import { useWidgetConfig } from "./widgetConfig";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import React from "react";
import { Poll } from "../../models/polls";
import { PollVotingForm } from "../polls/list/PollVotingForm";
import { PollResults } from "../polls/list/PollResults";

export const PollWidget = ({ ...props }) => {
  const { data, error, status } = useBetterQuery<Poll[]>(
    ["subsriptions.polls.get"],
    api.subscriptions.polls,
    { refetchOnWindowFocus: false }
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
        data.map((poll) =>
          poll.userHasVoted ? (
            <PollResults poll={poll} />
          ) : (
            <PollVotingForm poll={poll} />
          )
        )
      ) : null}
    </Widget>
  );
};
