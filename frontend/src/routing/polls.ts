import { ListPolls } from "../components/polls/list/ListPolls";
import { SubmitPoll } from "../components/polls/submit/SubmitPoll";
import { Route } from "./global";
import { PollsTableAdmin } from "../components/polls/table/PollsTableAdmin";
import { PollsTableUser } from "../components/polls/table/PollsTableUser";

export const routes: Route[] = [
    {
        path: "/anciens",
        component: () => ListPolls({ current: false }),
        exact: true,
    },
    {
        path: "/administration",
        component: PollsTableAdmin,
        exact: true,
    },
    {
        path: "/mes-sondages",
        component: PollsTableUser,
        exact: true,
    },
    {
        path: "/proposer",
        component: SubmitPoll,
        exact: true,
    },
    {
        path: "",
        component: () => ListPolls({ current: true }),
        exact: true,
    },
];
