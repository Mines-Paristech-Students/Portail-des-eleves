import React from "react";
import { formatDate } from "../../../utils/format";
import { PollStateIcon } from "./PollStateIcon";
import Button from "react-bootstrap/Button";
import { PollsTable } from "./PollsTable";
import { Column } from "../../utils/table/TableHeader";

export const PollsTableAdmin = () => (
    <PollsTable adminVersion={true} columnData={columnData} />
);

const columnData: (setEditPoll) => Column[] = (setEditPoll) => [
    {
        key: "question",
        header: "Contenu",
        render: (poll) => (
            <>
                {poll.question}
                <div className="small pollChoice">{poll.choices[0].text}</div>
                <div className="small pollChoice">{poll.choices[1].text}</div>
            </>
        ),
        canSort: true,
        headerClassName: "w-50",
    },
    {
        key: "user",
        header: "Auteur",
        canSort: true,
        cellClassName: "text-break",
    },
    {
        key: "publicationDate",
        render: (poll) => formatDate(poll.publicationDate),
        header: "Publication",
        canSort: true,
    },
    {
        key: "state",
        render: (poll) => (
            <div className="text-center">
                <PollStateIcon state={poll.state} />
            </div>
        ),
        header: "Statut",
        canSort: true,
    },
    {
        key: "action",
        render: (poll) => (
            <Button
                className="btn-icon mr-1"
                variant="outline-primary"
                size="sm"
                onClick={() => setEditPoll(poll)}
            >
                <i className="fe fe-check-square" />
            </Button>
        ),
        header: "Actions",
    },
];
