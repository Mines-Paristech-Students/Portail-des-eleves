import React, {FormEvent, useState} from 'react';
import {Poll} from "../../../models/polls";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

type Props = {
    poll: Poll,
};

export function ActivePollForm(props: Props) {
    const [selectedChoiceId, setSelectedChoiceId] = useState<string>();

    function onChange(choiceId: string) {
        setSelectedChoiceId(choiceId);
    }

    function onSubmit(event: FormEvent) {
        event.preventDefault();

        // TODO.
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <div className="selectgroup selectgroup-vertical w-100">
                    {
                        props.poll.choices.map(choice =>
                            <label key={"poll-choices-" + choice.id}
                                   className="selectgroup-item">
                                <Form.Control className="selectgroup-input"
                                              type="radio"
                                              name="poll-choices"
                                              value={choice.id}
                                              onChange={() => onChange(choice.id)}
                                              checked={choice.id === selectedChoiceId}>
                                </Form.Control>
                                <span className="selectgroup-button">{choice.text}</span>
                            </label>
                        )
                    }
                </div>
            </Form.Group>

            <Form.Group>
                <Button type="submit">Voter</Button>
            </Form.Group>
        </Form>
    );
}
