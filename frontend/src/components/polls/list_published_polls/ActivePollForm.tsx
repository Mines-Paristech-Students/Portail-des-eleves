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
                <Form.Label className="form-label poll-form-label">Ton choix</Form.Label>
                <div className="selectgroup selectgroup-vertical">
                    {
                        props.poll.choices.map(choice =>
                            <Form.Check type="radio"
                                        label={choice.text}
                                        name="choices"
                                        id="formHorizontalRadios1"
                                        value={choice.id}
                                        onChange={() => onChange(choice.id)}
                                        checked={choice.id === selectedChoiceId}>
                            </Form.Check>
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
