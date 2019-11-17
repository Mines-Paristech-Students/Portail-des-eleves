import React from 'react';
import {Poll, PollState} from "../../../models/polls";
import Form from "react-bootstrap/Form";
import {DateForm} from "../../DateForm";

type Props = {
    poll: Poll,
    setPoll: (poll: Poll) => void,
};

export function PollEditModalAdminBody(props: Props) {
    function handleChange(event: any) {
        const target = event.target as HTMLInputElement;
        const value = event.target.value;

        switch (target.name) {
            case "state":
                let newState = props.poll.state;

                switch (value) {
                    case "ACCEPTED":
                        newState = PollState.Accepted;
                        break;
                    case "REJECTED":
                        newState = PollState.Rejected;
                        break;
                    case "REVIEWING":
                        newState = PollState.Reviewing;
                        break;
                }

                props.setPoll({
                    ...props.poll,
                    state: newState,
                });
                break;
            case "admin-comment":
                props.setPoll({
                    ...props.poll,
                    adminComment: value,
                });
                break;
        }
    }

    function handleDateChange(newDate: Date) {
        props.setPoll({
            ...props.poll,
            publicationDate: newDate,
        });
    }

    return (
        <>
            <Form.Group>
                <Form.Label>Question</Form.Label>
                <p>{props.poll.question}</p>
            </Form.Group>

            <Form.Group>
                <Form.Label>Réponse 1</Form.Label>
                <p>{props.poll.choices[0].text}</p>
            </Form.Group>

            <Form.Group>
                <Form.Label>Réponse 2</Form.Label>
                <p>{props.poll.choices[1].text}</p>
            </Form.Group>

            <Form.Group>
                <Form.Label>Statut</Form.Label>

                <div className="selectgroup selectgroup-pills">
                    <label className="selectgroup-item">
                        <Form.Control className="selectgroup-input"
                                      type="radio"
                                      name="state"
                                      value="ACCEPTED"
                                      onChange={handleChange}
                                      checked={props.poll.state === PollState.Accepted}>
                        </Form.Control>
                        <span className="selectgroup-button selectgroup-button-icon">
                            <i className="fe fe-check text-success"/> Accepter
                        </span>
                    </label>
                    <label className="selectgroup-item">
                        <Form.Control className="selectgroup-input"
                                      type="radio"
                                      name="state"
                                      value="REJECTED"
                                      onChange={handleChange}
                                      checked={props.poll.state === PollState.Rejected}>
                        </Form.Control>
                        <span className="selectgroup-button selectgroup-button-icon">
                            <i className="fe fe-x text-danger"/> Refuser
                        </span>
                    </label>
                    <label className="selectgroup-item">
                        <Form.Control className="selectgroup-input"
                                      type="radio"
                                      name="state"
                                      value="REVIEWING"
                                      onChange={handleChange}
                                      checked={props.poll.state === PollState.Reviewing}>
                        </Form.Control>
                        <span className="selectgroup-button selectgroup-button-icon">
                            <i className="fe fe-eye text-warning"/> En attente
                        </span>
                    </label>
                </div>
            </Form.Group>

            {
                props.poll.state === PollState.Rejected &&
                <Form.Group>
                    <Form.Label>Commentaire</Form.Label>
                    <Form.Control type="text"
                                  name="admin-comment"
                                  value={props.poll.adminComment}
                                  onChange={handleChange}>
                    </Form.Control>
                </Form.Group>
            }

            {
                props.poll.state === PollState.Accepted &&
                <DateForm label="Date de publication"
                          date={props.poll.publicationDate}
                          onChange={handleDateChange}/>
            }
        </>
    );
}
