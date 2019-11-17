import React from 'react';
import {Poll} from "../../../models/polls";
import Form from "react-bootstrap/Form";

type Props = {
    poll: Poll,
    setPoll: (poll: Poll) => void,
};

export function PollEditModalUserBody(props: Props) {
    function handleChange(event: any) {
        const target = event.target as HTMLInputElement;
        const value = event.target.value;

        console.log(value);

        switch (target.name) {
            case "question":
                props.setPoll({
                    ...props.poll,
                    question: value,
                });
                break;
            case "choice-0":
                props.setPoll({
                    ...props.poll,
                    choices: [
                        {
                            ...props.poll.choices[0],
                            text: value,
                        },
                        ...props.poll.choices.slice(1)
                    ],
                });
                break;
            case "choice-1":
                props.setPoll({
                    ...props.poll,
                    choices: [
                        props.poll.choices[0],
                        {
                            ...props.poll.choices[1],
                            text: value,
                        },
                        ...props.poll.choices.slice(2)
                    ],
                });
                break;
        }
    }

    return (
        <>
            <Form.Group>
                <Form.Label>Question</Form.Label>
                <Form.Control type="text"
                              name="question"
                              value={props.poll.question}
                              onChange={handleChange}>
                </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Réponse 1</Form.Label>
                <Form.Control type="text"
                              name="choice-0"
                              value={props.poll.choices[0].text}
                              onChange={handleChange}>
                </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Réponse 2</Form.Label>
                <Form.Control type="text"
                              name="choice-1"
                              value={props.poll.choices[1].text}
                              onChange={handleChange}>
                </Form.Control>
            </Form.Group>
        </>
    );
}
