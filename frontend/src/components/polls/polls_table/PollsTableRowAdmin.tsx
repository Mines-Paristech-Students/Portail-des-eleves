import React, { useState } from "react";
import { Poll } from "../../../models/polls";
import { dateFormatter } from "../../../utils/format";
import Button from "react-bootstrap/Button";
import { PollEditModal } from "./PollEditModal";
import { PollStateIcon } from "./PollStateIcon";

export const PollsTableRowAdmin = ({ poll, refetch }: {
    poll: Poll,
    refetch: any
}) => {
    const [editable, setEditable] = useState<boolean>(false);

    return <tr>
        <PollEditModal
            show={editable}
            onHide={() => setEditable(false)}
            poll={poll}
            refetch={refetch}
            isAdmin={true}
        />
        <td>{poll.question}</td>
        <td>{poll.choices[0].text}</td>
        <td>{poll.choices[1].text}</td>
        <td>
            {poll.publicationDate &&
            dateFormatter(poll.publicationDate)}
        </td>
        <td>{poll.user}</td>
        <td className="text-center">
            <PollStateIcon state={poll.state}/>
        </td>
        {
            // Open-the-modal button.
        }
        <td className="text-center">
            <Button
                className="btn-icon mr-1"
                variant="outline-primary"
                size="sm"
                onClick={
                    (event) => {
                        event.preventDefault();
                        setEditable(true);
                    }
                }
            >
                <i className="fe fe-check-square"/>
            </Button>
        </td>
    </tr>;
};
