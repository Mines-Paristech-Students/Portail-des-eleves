import React from "react";
import { Administration } from "../edit/Administration";
import dayjs from "dayjs";
import { ArrowLink } from "../../../utils/ArrowLink";
import { PageTitle } from "../../../utils/PageTitle";
import { useHistory } from "react-router-dom";

export const AssociationCreateElection = ({ association }) => {
  const history = useHistory();

  return (
    <>
      <PageTitle>
        <ArrowLink to={`/associations/${association.id}/votes/`} />
        Nouvelle élection
      </PageTitle>
      <Administration
        election={{
          association: association.id,
          id: "",
          name: "Nouvelle élection",
          startsAt: dayjs().add(1, "day").toDate(),
          endsAt: dayjs().add(2, "day").toDate(),
          maxChoicesPerBallot: 1,
          choices: [],
          voters: [],
          resultsArePublished: false,
        }}
        onChange={(election) => {
          history.push(`/associations/${association.id}/votes/${election.id}`);
        }}
      />
    </>
  );
};
