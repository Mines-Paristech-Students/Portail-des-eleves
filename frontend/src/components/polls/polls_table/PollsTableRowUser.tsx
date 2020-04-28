import React, { useContext, useState } from "react";
import { Poll, PollState } from "../../../models/polls";
import { dateFormatter } from "../../../utils/format";
import Button from "react-bootstrap/Button";
import { PollEditModal } from "./PollEditModal";
import { PollStateIcon } from "./PollStateIcon";
import { api } from "../../../services/apiService";
import { ToastContext, ToastLevel } from "../../../utils/Toast";

export const PollsTableRowUser = ({
    poll,
    refetch
}: {
    poll: Poll;
    refetch: any;
}) => {
    const newToast = useContext(ToastContext);
    const [editable, setEditable] = useState<boolean>(false);

    const onClickEdit = (event: React.FormEvent) => {
        event.preventDefault();
        setEditable(true);
    };

    const onClickDelete = (event: React.FormEvent) => {
        event.preventDefault();

        api.polls
            .delete(poll.id)
            .then(response => {
                if (response.status === 204) {
                    newToast({
                        message: "Sondage supprimé.",
                        level: ToastLevel.Success
                    });
                    refetch({ force: true });
                }
            })
            .catch(error => {
                let message =
                    "Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste.";
                let detail = error.response.data.detail;

                if (error.response.status == 403) {
                    detail =
                        "Vous n’avez pas le droit de supprimer ce sondage.";
                }

                newToast({
                    message: `${message} Détails : ${detail}`,
                    level: ToastLevel.Error
                });
            });
    };

    return (
        <tr>
            <PollEditModal
                show={editable}
                onHide={() => setEditable(false)}
                poll={poll}
                refetch={refetch}
                isAdmin={false}
            />
            <td>{poll.question}</td>
            <td>{poll.choices[0].text}</td>
            <td>{poll.choices[1].text}</td>
            <td>
                {poll.state === PollState.Accepted &&
                    poll.publicationDate &&
                    dateFormatter(poll.publicationDate)}
            </td>
            <td className="text-center">
                <PollStateIcon state={poll.state} />
            </td>
            <td>{poll.adminComment}</td>
            <td className="text-center">
                {poll.state === PollState.Reviewing ||
                poll.state === PollState.Rejected ? (
                    <>
                        <Button
                            className="btn-icon m-1"
                            variant="outline-primary"
                            size="sm"
                            onClick={onClickEdit}
                        >
                            <i className="fe fe-edit" />
                        </Button>
                        <Button
                            className="btn-icon m-1"
                            variant="outline-danger"
                            size="sm"
                            onClick={onClickDelete}
                        >
                            <i className="fe fe-trash-2" />
                        </Button>
                    </>
                ) : null}
            </td>
        </tr>
    );
};
