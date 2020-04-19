import React, {useContext, useState} from "react";
import {Form, Button, Col, InputGroup, Alert} from "react-bootstrap";
import { api, useBetterQuery } from "../../../services/apiService";
import { useParams } from "react-router";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import {Choice, Election} from "../../../models/associations/election";
import {PageTitle} from "../../../utils/common";
import {User} from "../../../models/user";


export const AssociationCreateElection = ({ association, ...props }) => {
    const election: Election = {
        name: "",
        choices: [{
            id: 0, election: 0, name:""
        }, {
            id:0, election: 0, name:""
        }],
        registeredVoters: ['17bocquet', '17wan-fat'], //to-do : change to []
        startsAt: new Date(),
        endsAt: new Date(),
        maxChoicesPerBallot: 1,
        association: association.id,
    };

    return (
        <>
            <PageTitle className={"mt-6"}>Création d'une élection</PageTitle>
            <EditElection {...props} election={election} association={association} edit={false}/>
        </>
    )
};

export const AssociationEditElection = ({ association, ...props }) => {
    const { electionId } = useParams<{electionId: string}>();

    const { data: election, status, error } = useBetterQuery<Election>(
        "election.get",
        api.elections.get,
        electionId
    );

    if (status === "loading") return "Chargement en cours...";
    else if (status === "error") return `Une erreur est apparue: ${error}`;
    else if (election)
        return (
            <>
                <PageTitle className={"mt-6"}>Modification d'une élection</PageTitle>
                <p>Attention ! C'est la supprimer et la remplacer. Tous les votes seront perdus. </p>
                <EditElection {...props} election={election} association={association} edit={true}/>
            </>
        );
    return null;
};

const EditElection = ({ election, association, ...props }) => {
    const listOfChoicesNames = (choices: Choice[]) => {
        const result: string[] = [];
        choices.map((choice) => result.push(choice.name));
        return result
    };

    const newToast = useContext(ToastContext);

    const [name, setName] = useState<string>(election.name);
    const [choices, setChoices] = useState<string[]>(listOfChoicesNames(election.choices));
    const [registeredVoters, setRegisteredVoters] = useState<User[]>(election.registeredVoters);
    const [startsAt, setStartsAt] = useState<Date>(new Date(election.startsAt));
    const [endsAt, setEndsAt] = useState<Date>(new Date(election.endsAt));
    const [maxChoicesPerBallot, setMaxChoicesPerBallot] = useState<number>(election.maxChoicesPerBallot);

    const [formCorrections, setFormCorrections] = useState<string[]>([]);
    const formCorrectionsAlert = formCorrections.length > 0 ?
        <Alert variant="danger" onClose={() => setFormCorrections([])} dismissible>
            <Alert.Heading>Votre élection comporte des erreurs :</Alert.Heading>
            <ul>
                {formCorrections.map(msg =>
                    <li key={msg}>
                        {msg}
                    </li>
                )}
            </ul>
        </Alert>
        :<></>;

    const listOfChoicesNamesOnlyObject  = (names: string[]) => {
        const nameObjects : Object[] = [];
        names.map((name) => nameObjects.push({
            name: name
        }));
        return nameObjects
    };

    const handleSubmit = () => {
        if (!formIsCorrect()) {
            return null;
        }

        const newElection: Election = {
            name: name,
            association: association.id,
            choices: listOfChoicesNamesOnlyObject(choices),
            registeredVoters: registeredVoters,
            startsAt: startsAt,
            endsAt: endsAt,
            maxChoicesPerBallot: maxChoicesPerBallot,
        };
        newToast({
            message: "Sauvegarde en cours",
            level: ToastLevel.Success
        });
        api.elections
            .save(newElection, props.edit, election.id)
            .then(res => {
                newToast({
                    message: "Election enregistrée",
                    level: ToastLevel.Success
                });
            }).then(() => props.history.push(`/associations/${association.id}`))
            .catch(err => {
                newToast({
                    message: err.message,
                    level: ToastLevel.Error,
                    delay: 2000
                });
            });
    };

    const deleteElection = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Supprimer l'élection ? Cette action est irréversible")) {
            api.elections
                .delete(election)
                .then(res => {
                    props.history.push(`/associations/${association.id}`);
                })
                .catch(err => {
                    newToast({
                        message: err.message,
                        level: ToastLevel.Error
                    });
                });
        }
    };

    const formIsCorrect = () => {
        const formCorrections :string[] = [];
        let isCorrect = true;
        if (name==='') {
            isCorrect=false;
            formCorrections.push('Le titre ne peut pas être vide')
        }
        if (startsAt >= endsAt) {
            isCorrect=false;
            formCorrections.push("L'élection ne peut pas se terminer avant de commencer")
        }
        if (choices.includes("")) {
            isCorrect=false;
            formCorrections.push('Un choix ne peut pas être vide')
        }
        setFormCorrections(formCorrections);
        return isCorrect;
    };

    return (
        <>
            {formCorrectionsAlert}
            <p>Pensez à ajouter un option pour le vote blanc si vous voulez le différencier de l'abstention.</p>
            <form onSubmit={() => null}>
                <Form.Group className="mt-6">
                    <Form.Row>
                        <h4>Nom</h4>
                    </Form.Row>
                    <Form.Control
                        id="name"
                        name="name"
                        type="text"
                        className="my-2 form-control-lg"
                        placeholder="Entrez un nom"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                    />
                </Form.Group>
                <Form.Row>
                    <Form.Group className='mt-1'>
                        <h4>Dates</h4>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Début</Form.Label>
                                <Form.Control
                                    id="startDate"
                                    name="startDate"
                                    type="datetime-local"
                                    className="my-2 form-control-g"
                                    value={toGoodString(startsAt)}
                                    onChange={(e) => setStartsAt(new Date(e.target.value))}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Fin</Form.Label>
                                <Form.Control
                                    id="endDate"
                                    name="endDate"
                                    type="datetime-local"
                                    className="my-2 form-control-g"
                                    value={toGoodString(endsAt)}
                                    onChange={(e) => {
                                        setEndsAt(new Date(e.target.value))}}
                                    required
                                />
                            </Form.Group>
                        </Form.Row>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group  className={'mt-1'}>
                        <h4>Choix</h4>
                        <Form.Group>
                            <ListOfChoices
                                choices={choices}
                                onChange={(e, k)=> {
                                    const newChoicesState = choices.slice();
                                    newChoicesState[k] = e.target.value;
                                    setChoices(newChoicesState)
                                }}
                                onDelete={k => {
                                    const newChoicesState = choices.slice();
                                    newChoicesState.splice(k,1);
                                    setChoices(newChoicesState)
                                }}
                            />
                            <NewChoiceInputButton
                                onClick={() => {
                                    const newChoicesState = choices.slice();
                                    newChoicesState.push("");
                                    setChoices((newChoicesState));
                                }}
                            />
                        </Form.Group>
                        <Form.Row>
                            <Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>
                                        Nombre de choix par vote
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group as={Col} md={'6'}>
                                    <Form.Control
                                        id="maxChoicesPerBallot"
                                        name="maxChoicesPerBallot"
                                        type="number"
                                        className="form-control"
                                        value={maxChoicesPerBallot.toString()}
                                        onChange={(e) => setMaxChoicesPerBallot(Math.max(e.target.value, 1))}
                                        required
                                    />

                                </Form.Group>
                             </Form.Group>
                        </Form.Row>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    Il manque encore les registered voters pour l'instant 17bocquet et 17wan-fat par defaut
                </Form.Row>
                <Form.Row>
                    <Form.Group>
                        {(props.edit) ?
                            <Button
                                variant="danger"
                                className={"mr-3"}
                                type="button"
                                onClick={deleteElection}
                            >
                                Supprimer
                            </Button> : <></>
                        }
                        <Button
                            variant="primary"
                            type="button"
                            onClick={handleSubmit}
                        >
                            {props.edit? "Supprimer et remplacer":"Créer l'élection"}
                        </Button>
                    </Form.Group>
                </Form.Row>
            </form>
        </>
    );
};

const ListOfChoices = props => {
    const list = props.choices.map((choice, k) =>
        <Col>
            <ChoiceInput
                id={k}
                onChange={(e) => props.onChange(e, k)}
                onDelete={() => props.onDelete(k)}
                text={choice}
            />
        </Col>
    );

    const workOnList = (list: any[], n: number) => {
        const lists : any[][]= [];
        list.map((o, k) => {
            if (k % n === 0) {
                lists.push([o])
            } else {
                lists[lists.length -1].push(o)
            }
            return null;
        });
        return lists
    };
    const newList = workOnList(list, 3);

    return (
        <>
            {newList.map(l =>
                <Form.Row>
                    {l}
                </Form.Row>
            )}
        </>
    )
};

const ChoiceInput = props => {
    return (
        <InputGroup className="my-2 form-control-g">
            <Form.Control
                id={"choice" + props.id}
                name={"choice" + props.id}
                type="text"
                placeholder={'Entrez un choix'}
                value={props.text}
                onChange={(e) => props.onChange(e)}
                required
            />
            <InputGroup.Append>
                <Button
                    onClick={() => props.onDelete()}
                    variant={'secondary'}
                >
                    <i className="fe fe-trash-2"/>
                </Button>
            </InputGroup.Append>
        </InputGroup>

    )
};

const NewChoiceInputButton = (props) => {
    return (
        <Button
            variant={'outline-dark'}
            onClick={() => props.onClick()}
        >
            Nouvelle option
        </Button>
    )
};

const toGoodString = (date: Date) => {
    const getGoodMonth = (date: Date) => {
        const month = date.getMonth() + 1;
        if (month < 10) {
            return "0" + month
        }
        return month
    };

    const getGoodDate = (date: Date) => {
        const date1 = date.getDate();
        if (date1 < 10) {
            return "0" + date1
        }
        return date1
    };

    const getGoodHours = (date: Date) => {
        const hours = date.getHours();
        if (hours < 10) {
            return "0" + hours
        }
        return hours
    };

    const getGoodMinutes = (date: Date) => {
        const minutes = date.getMinutes();
        if (minutes < 10) {
            return "0" + minutes
        }
        return minutes
    };

    const getGoodYear = (date: Date) => {
        const year = date.getFullYear();
        if (year < 1000) {
            return "0" + year
        } else if (year < 100) {
            return "00" + year
        } else if (year < 10) {
            return "000" + year
        }
        return year
    };

    if (date) {
        return (getGoodYear(date) + '-' + getGoodMonth(date) + '-' + getGoodDate(date) + 'T' + getGoodHours(date) + ':' + getGoodMinutes(date))
    }
    return ''
};
