import { Homepage } from "../pages/Homepage";
import { AssociationList } from "../pages/associations/List";
import { AssociationMain } from "../pages/associations/Main";
import { ListPolls } from "../components/polls/list_polls/ListPolls";
import { PollsTable } from "../components/polls/polls_table/PollsTable";
import { SubmitPoll } from "../components/polls/submit_polls/SubmitPoll";

export const routes = [
    { path: "/", component: Homepage, exact: true },
    { path: "/associations", component: AssociationList, exact: true },
    {
        path: "/associations/:associationId",
        component: AssociationMain,
        exact: false
    },
    {
        path: "/sondages",
        component: () => ListPolls({ active: true }),
        exact: true
    },
    {
        path: "/sondages/anciens",
        component: () => ListPolls({ active: false }),
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
