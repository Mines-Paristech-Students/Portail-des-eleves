import { ListPolls } from "../components/polls/list_polls/ListPolls";
import { SubmitPoll } from "../components/polls/submit_polls/SubmitPoll";
import { Route } from "./global";
import { Test } from "../components/polls/test/Test";
import { PollsTableAdmin } from "../components/polls/polls_table/PollsTableAdmin";
import { PollsTableUser } from "../components/polls/polls_table/PollsTableUser";

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
        component: PollsTableAdmin,
        exact: true
    },
    {
        path: "/sondages/mes-sondages",
        component: PollsTableUser,
        exact: true
    },
    {
        path: "/sondages/proposer",
        component: SubmitPoll,
        exact: true
    },
    {
        path: "/sondages/test",
        component: Test,
        exact: true
    }
];
