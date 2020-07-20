import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api, useBetterQuery } from "../../../../services/apiService";
import { Election } from "../../../../models/associations/election";
import { Loading } from "../../../utils/Loading";
import { ErrorPage } from "../../../utils/ErrorPage";
import { PageTitle } from "../../../utils/PageTitle";
import dayjs from "dayjs";
import Chart from "chart.js";
import { Card } from "react-bootstrap";
import { VoteCard } from "./Vote";
import { Association } from "../../../../models/associations/association";
import { UserContext } from "../../../../services/authService";

const offLineColors = [
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

const onLineColors = offLineColors.map((c) => c.slice(0, -2) + "0.9)");

export const AssociationViewElection = ({
  association,
}: {
  association: Association;
}) => {
  const { electionId } = useParams<{ electionId: string }>();
  const { data: election, status, error } = useBetterQuery<Election>(
    ["election.get", electionId],
    api.elections.get
  );

  const resultsChartRef = useRef(null);
  const electionStatus = !election
    ? undefined
    : election.endsAt < new Date()
    ? "FINISHED"
    : election.startsAt > new Date()
    ? "PLANNED"
    : "ACTIVE";

  const user = useContext(UserContext);
  const [isUserAllowed, setIsUserAllowed] = useState(true);

  useEffect(() => {
    if (election) {
      setIsUserAllowed(
        election.userVoter !== undefined ||
          association.myRole?.permissions.includes("election") ||
          false
      );
    }
  }, [association.myRole, election, user]);

  useEffect(() => {
    // Wait for all vars to be available
    if (!resultsChartRef || !resultsChartRef.current || !election) {
      return;
    }

    // Don't init the chart if results aren't accessible
    if (
      !(
        (election.showResults || election.resultsArePublished) &&
        electionStatus === "FINISHED"
      )
    ) {
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
            backgroundColor: offLineColors,
          },
          {
            label: "Votes en ligne",
            data: election.choices.map((choice) => choice.numberOfOnlineVotes),
            backgroundColor: onLineColors,
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
      },
    });
  });

  return !isUserAllowed ? (
    <ErrorPage title={"Accès interdit"} errorCode={403}>
      Vous n'êtes ni voteur ni administrateur de ce vote
    </ErrorPage>
  ) : status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <ErrorPage>{error}</ErrorPage>
  ) : election ? (
    <>
      <PageTitle>{election.name}</PageTitle>

      <Card>
        <Card.Header>
          <Card.Title>
            Statut :{" "}
            {electionStatus === "PLANNED"
              ? `prévu pour le ${dayjs(election.startsAt).format(
                  "DD/MM/YYYY à HH:MM"
                )}`
              : electionStatus === "FINISHED"
              ? `terminé le ${dayjs(election.endsAt).format(
                  "DD/MM/YYYY à HH:MM"
                )}`
              : "en cours"}
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
          </Card.Header>
          <Card.Body>
            {election.showResults || election.resultsArePublished ? (
              <canvas id="resultsChart" ref={resultsChartRef} />
            ) : (
              <p className="text-center lead">
                Les résultats n'ont pas encore été publiés
              </p>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  ) : null;
};
