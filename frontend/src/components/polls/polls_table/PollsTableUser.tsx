import React, { useContext } from "react";
import { PollStateIcon } from "./PollStateIcon";
import Button from "react-bootstrap/Button";
import { PollsTable } from "./PollsTable";
import { PollState } from "../../../models/polls";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../services/apiService";
import { AxiosError } from "axios";

export const PollsTableUser = () => {
    const newToast = useContext(ToastContext);

    const [remove] = useMutation(api.polls.remove, {
        onSuccess: response => {
            queryCache.refetchQueries(["polls.list"]);

            if (response.status === 204) {
                newToast({
                    message: "Sondage supprimé.",
                    level: ToastLevel.Success
                });
            }
        },
        onError: errorAsUnknown => {
            const error = errorAsUnknown as AxiosError;

            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    error.response
                        ? "Détails : " +
                          (error.response.status === 403
                              ? "vous n’avez pas le droit de supprimer ce sondage."
                              : error.response.data.detail)
                        : ""
                }`,
                level: ToastLevel.Error
            });
        }
    });

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
            canSort: true,
            headerClassName: "w-50"
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
            key: "adminComment",
            header: "Commentaire",
            cellClassName: "text-break"
        },
        {
            key: "action",
            render: poll => (
                <>
                    {poll.state === PollState.Reviewing ? (
                        <Button
                            className="btn-icon m-1"
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setEditPoll(poll)}
                        >
                            <i className="fe fe-edit" />
                        </Button>
                    ) : null}
                    {poll.state === PollState.Reviewing ||
                    poll.state === PollState.Rejected ? (
                        <Button
                            className="btn-icon m-1"
                            variant="outline-danger"
                            size="sm"
                            onClick={() => remove({ pollId: poll.id })}
                        >
                            <i className="fe fe-trash-2" />
                        </Button>
                    ) : null}
                </>
            ),
            header: "Actions"
        }
    ];

    return <PollsTable adminVersion={false} columnData={columnData} />;
};
