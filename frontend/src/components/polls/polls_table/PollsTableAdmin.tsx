import React from "react";
import { formatDate } from "../../../utils/format";
import { PollStateIcon } from "./PollStateIcon";
import Button from "react-bootstrap/Button";
import { PollsTable } from "./PollsTable";

export const PollsTableAdmin = () => {
    const columnData = setEditPoll => [
        {
            key: "question",
            header: "Contenu",
            render: poll => (
                <>
                    {poll.question}
                    <div className="small pollChoice">
                        {poll.choices[0].text}
                    </div>
                    <div className="small pollChoice">
                        {poll.choices[1].text}
                    </div>
                </>
            ),
            canSort: true
        },
        {
            key: "user",
            header: "Auteur",
            canSort: true
        },
        {
            key: "publicationDate",
            render: poll => formatDate(poll.publicationDate),
            header: "Publication",
            canSort: true
        },
        {
            key: "state",
            render: poll => (
                <div className="text-center">
                    <PollStateIcon state={poll.state} />
                </div>
            ),
            header: "Statut",
            canSort: true
        },
        {
            key: "action",
            render: poll => (
                <Button
                    className="btn-icon mr-1"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setEditPoll(poll)}
                >
                    <i className="fe fe-check-square" />
                </Button>
            ),
            header: "Actions"
        }
    ];

    return <PollsTable adminVersion={true} columnData={columnData} />;
};
