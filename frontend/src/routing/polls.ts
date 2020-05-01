import { ListPolls } from "../components/polls/list_polls/ListPolls";
import { PollsTable } from "../components/polls/polls_table/PollsTable";
import { SubmitPoll } from "../components/polls/submit_polls/SubmitPoll";
import { Route } from "./global";

export const routes: Route[] = [
    {
        path: "/sondages",
        component: () => ListPolls({ current: true }),
        exact: true
    },
    {
        path: "/sondages/anciens",
        component: () => ListPolls({ current: false }),
        exact: true
    },
    {
        path: "/sondages/administration",
        component: () => PollsTable({ adminVersion: true }),
        exact: true
    },
    {
        path: "/sondages/mes-sondages",
        component: PollsTable,
        exact: true
    },
    {
        path: "/sondages/proposer",
        component: SubmitPoll,
        exact: true
    }
];
