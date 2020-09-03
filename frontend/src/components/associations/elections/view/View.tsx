import React, { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { api, useBetterQuery } from "../../../../services/apiService";
import { Election } from "../../../../models/associations/election";
import { Loading } from "../../../utils/Loading";
import { ErrorPage, ForbiddenError } from "../../../utils/ErrorPage";
import { PageTitle } from "../../../utils/PageTitle";
import dayjs from "dayjs";
import Chart from "chart.js";
import { Card } from "react-bootstrap";
import { VoteCard } from "./Vote";
import { Association } from "../../../../models/associations/association";
import { Administration } from "../edit/Administration";
import { RegistrationList } from "../edit/RegistrationList";
import { OfflineVotes } from "../edit/OfflineVotes";
import { VoterStatus } from "../edit/VoterStatus";
import { ArrowLink } from "../../../utils/ArrowLink";
import { queryCache, useMutation } from "react-query";
import { ToastContext } from "../../../utils/Toast";
import { EditChoices } from "../edit/EditChoices";
import { DeleteForm } from "../edit/DeleteForm";
import { genericMutationErrorHandling } from "../../../../utils/genericMutationErrorHandling";

const offlineColors = [
  "rgba(33,150,243)",
  "rgba(229,57,53)",
  "rgba(124,179,66)",
  "rgba(253,216,53)",
  "rgba(142,36,170)",
  "rgba(216,27,96)",
  "rgba(251,140,0)",
  "rgba(84,110,122)",
  "rgba(0,137,123)",
  "rgba(229,57,53)",
];

const onlineColors = offlineColors.map((c) => c.slice(0, -2) + "0.9)");

export const AssociationViewElection = ({
  association,
}: {
  association: Association;
}) => {
  const { electionId } = useParams<{ electionId: string }>();
  const { data: election, status, error } = useBetterQuery<Election>(
    ["election.get", electionId],
    api.elections.get,
    { refetchOnWindowFocus: false }
  );

  const electionStatus = !election
    ? undefined
    : election.endsAt < new Date()
    ? "FINISHED"
    : election.startsAt > new Date()
    ? "PLANNED"
    : "ACTIVE";

  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const isElectionAdmin = association.myRole?.permissions.includes("election");

  // Handle vote results publication
  const [publishElectionResults] = useMutation(api.elections.update, {
    onSuccess: (response) => {
      queryCache.invalidateQueries(["election.get", electionId]);
      sendSuccessToast(
        response.resultsArePublished ? "Résultats publiés" : "Résultats masqués"
      );
    },
    onError: genericMutationErrorHandling(sendErrorToast),
  });

  return election?.userVoter === undefined && !isElectionAdmin ? (
    <ForbiddenError />
  ) : status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <ErrorPage>{error}</ErrorPage>
  ) : election ? (
    <>
      <PageTitle>
        <ArrowLink to={`/associations/${association.id}/votes/`} />
        {election.name}
      </PageTitle>

      <Card>
        <Card.Header>
          <Card.Title>
            {electionStatus === "PLANNED"
              ? `Prévue pour le ${dayjs(election.startsAt).format(
                  "DD/MM/YYYY à HH:MM"
                )}`
              : electionStatus === "FINISHED"
              ? `Terminée le ${dayjs(election.endsAt).format(
                  "DD/MM/YYYY à HH:MM"
                )}`
              : "En cours"}
          </Card.Title>
        </Card.Header>
      </Card>

      {election.userVoter && electionStatus === "ACTIVE" && (
        <VoteCard election={election} />
      )}

      {electionStatus === "FINISHED" && (
        <Card>
          <Card.Header>
            <Card.Title>Résultats</Card.Title>
            {isElectionAdmin && (
              <div className="card-options">
                <label className="custom-switch m-0">
                  <span className={"mr-2"}>Publier les résultats</span>
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    checked={election.resultsArePublished}
                    onChange={() =>
                      publishElectionResults({
                        id: election.id,
                        results_are_published: !election?.resultsArePublished,
                      })
                    }
                  />
                  <span className="custom-switch-indicator" />
                </label>
              </div>
            )}
          </Card.Header>
          <Card.Body>
            {(election.showResults || isElectionAdmin) && (
              <ElectionResultChart election={election} />
            )}

            {!election.showResults && (
              <div className={"text-center"}>
                <p className="lead">
                  Les résultats n'ont pas encore été publiés
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {isElectionAdmin && (
        <div className={"mb-5"}>
          <Administration election={election} />
          {new Date() < election.startsAt && (
            <>
              <EditChoices election={election} />
              <RegistrationList election={election} />
            </>
          )}
          {election.startsAt < new Date() && new Date() < election.endsAt && (
            <VoterStatus election={election} />
          )}
          {election.startsAt < new Date() && (
            <OfflineVotes election={election} />
          )}

          <DeleteForm election={election} />
        </div>
      )}
    </>
  ) : null;
};

const ElectionResultChart = ({ election }) => {
  const resultsChartRef = useRef(null);

  useEffect(() => {
    // Wait for all vars to be available
    if (!resultsChartRef || !resultsChartRef.current || !election) {
      return;
    }

    // Necessary because at this point resultsChartRef is not null but the TS
    // compiler isn't aware of this
    // @ts-ignore
    new Chart(resultsChartRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: election?.choices.map(
          (choice) => `${choice.name} (${choice.numberOfVotes} votes)`
        ),
        datasets: [
          {
            label: "Votes hors ligne",
            data: election.choices.map((choice) => choice.numberOfOfflineVotes),
            backgroundColor: offlineColors,
          },
          {
            label: "Votes en ligne",
            data: election.choices.map((choice) => choice.numberOfOnlineVotes),
            backgroundColor: onlineColors,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
        },
        legend: false,
        animation: {
          duration: 0,
        },
      },
    });
  });

  return <canvas id="resultsChart" ref={resultsChartRef} />;
};
