import React from "react";
import { Link } from "react-router-dom";

export const PollNoPolls = () => (
  <>
    <h3>Pas de sondage !</h3>

    <Link
      to="/sondages/proposer"
      className="d-block w-100 mb-2 btn btn-secondary btn-square"
    >
      C’est terrible, je vais de ce pas en proposer un !
    </Link>
    <Link
      to="/sondages/proposer"
      className="d-block w-100 mb-2 btn btn-secondary btn-square"
    >
      OK, laissez-moi faire le boulot du VP geek à sa place…
    </Link>
  </>
);
