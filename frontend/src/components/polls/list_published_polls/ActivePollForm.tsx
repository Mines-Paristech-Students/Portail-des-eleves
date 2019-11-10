import React, {FormEvent, useState} from 'react';
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {Poll} from "../../../models/polls";

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
            <FormGroup>
                <Label className="form-label poll-form-label">Ton choix</Label>
                <div className="selectgroup selectgroup-vertical">
                    {
                        props.poll.choices.map(choice =>
                            <Label className="selectgroup-item poll-form-button" key={choice.id}>
                                <Input className="selectgroup-input"
                                       type="radio"
                                       name="choices"
                                       value={choice.id}
                                       checked={choice.id === selectedChoiceId}
                                       onChange={() => onChange(choice.id)}/>
                                <span className="selectgroup-button poll-form-button-text">{choice.text}</span>
                            </Label>
                        )
                    }
                </div>
            </FormGroup>

            <FormGroup>
                <Button>Voter</Button>
            </FormGroup>
        </Form>
    );
}
