import React, {useState} from 'react';
import {Poll, PollState} from "../../../models/polls";
import {dateFormatter} from "../../../utils/format";
import {PollsTableRowAdminComment} from "./PollsTableRowAdminComment";
import {PollsTableRowState} from "./PollsTableRowState";

type Props = {
    poll: Poll,
};

export function PollsTableRowAdmin(props: Props) {
    const [editable, setEditable] = useState<boolean>(false);

    const administrateAction = (
        <a href="#"
           className="administrate-action"
           onClick={_ => setEditable(true)}>
            <i className="fe fe-check-square"/>
        </a>
    );

    const submitAction = (
        <a href="#">Submit</a>
    );

    function getAction(): React.ReactElement {
        return editable ? submitAction : administrateAction;
    }

    return (
        <tr>
            <td>{props.poll.question}</td>
            <td>{dateFormatter(props.poll.publicationDate)}</td>
            <td>Auteur…</td>
            <PollsTableRowState pollState={props.poll.state}
                                setPollState={console.log}
                                editable={editable}/>
            <PollsTableRowAdminComment adminComment={props.poll.adminComment}
                                       setAdminComment={console.log}
                                       editable={editable}/>
            <td>{getAction()}</td>
        </tr>
    );
}
