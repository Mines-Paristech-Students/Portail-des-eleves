import { ListAllPolls } from "../components/polls/list/ListPolls";
import { SubmitPoll } from "../components/polls/submit/SubmitPoll";
import { Route } from "./global";
import { PollsTableAdmin } from "../components/polls/table/PollsTableAdmin";
import { PollsTableUser } from "../components/polls/table/PollsTableUser";

export const routes: Route[] = [
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
    component: ListAllPolls,
    exact: true,
  },
];
