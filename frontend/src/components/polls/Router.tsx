import React from "react";

import { routes } from "../../routing/polls";
import { GenericRouter } from "../../routing/GenericRouter";

export const PollsRouter = ({ match }) => (
    <GenericRouter match={match} routes={routes} />
);
