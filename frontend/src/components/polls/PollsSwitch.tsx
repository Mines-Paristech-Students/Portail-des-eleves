import React from "react";
import { Route } from "react-router";
import { PollsTable } from "./polls_table/PollsTable";
import { ListPolls } from "./list_polls/ListPolls";
import { Switch, useRouteMatch } from "react-router-dom";
import { SubmitPoll } from "./submit_polls/SubmitPoll";

export function PollsSwitch() {
    let { path }: any = useRouteMatch();

    return (
        <Switch>
            <Route exact path={String(path)}>
                <ListPolls />
            </Route>
            <Route path={`${path}/administration/`}>
                <PollsTable adminVersion />
            </Route>
            <Route exact path={`${path}/mes-sondages/`}>
                <PollsTable />
            </Route>
            <Route path={`${path}/proposer/`}>
                <SubmitPoll />
            </Route>
        </Switch>
    );
}
