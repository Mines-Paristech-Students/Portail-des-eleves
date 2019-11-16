import React, {useState} from 'react';
import {Poll, PollState} from "../../../models/polls";
import {dateFormatter} from "../../../utils/format";
import {PollsTableRowAdminComment} from "./PollsTableRowAdminComment";
import {PollsTableRowState} from "./PollsTableRowState";

type Props = {
    poll: Poll,
    adminVersion?: boolean
};

export function PollsTableRow(props: Props) {
    const updateAction = <a href="#" className="update-action"><i className="fe fe-edit"/> </a>;
    const deleteAction = <a href="#" className="delete-action"><i className="fe fe-trash-2"/> </a>;
    const administrateAction = <a href="#" className="administrate-action"><i className="fe fe-check-square"/> </a>;

    const [editable, setEditable] = useState<boolean>(false);

    function getActions(): React.ReactElement[] {
        // Please refer to backend.polls.permissions for having a clearer view of the different actions permitted.
        // Please remind that "update" may mean "edit" (the question, for instance) or "administrate" (accepting or
        // refusing the poll).
        let actions: React.ReactElement[] = [];

        if (props.adminVersion) {
            actions = [administrateAction];
        } else {
            if (props.poll.state === PollState.Reviewing) {
                actions = [updateAction];
            }

            actions.push(deleteAction);
        }

        return actions
    }

    return (
        <tr>
            <td>{props.poll.question}</td>
            <td>{dateFormatter(props.poll.publicationDate)}</td>
            {props.adminVersion && <td>Auteur…</td>}
            <PollsTableRowState pollState={props.poll.state}
                                setPollState={console.log}
                                editable={props.adminVersion && editable}/>
            <PollsTableRowAdminComment adminComment={props.poll.adminComment}
                                       setAdminComment={console.log}
                                       editable={props.adminVersion && editable}/>
            <td>{getActions()}</td>
        </tr>
    );
}
