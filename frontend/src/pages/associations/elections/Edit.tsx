import React, {useContext} from "react";
import {Form, Button, Col, InputGroup, Card} from "react-bootstrap";
import { api, useBetterQuery } from "../../../services/apiService";
import { useParams } from "react-router";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import {Choice, Election} from "../../../models/associations/election";
import {PageTitle} from "../../../utils/common";
import "react-day-picker/lib/style.css";
import {Formik, useField} from "formik";
import {DateTimePickerField} from "../../../components/utils/forms/DatePickerField";

interface Dates {
    startsAt: Date,
    endsAt: Date,
}

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

    const newToast = useContext(ToastContext);

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

    return (
        <Card>
            <EditElectionForm
                election={election}
                association={association}
                edit={props.edit}
                onDelete={deleteElection}
                className={'ml-5 mr-5'}
            />
        </Card>
    );
};

const EditElectionForm = ({election, association, ...props}) => {
    const newToast = useContext(ToastContext);

    const listOfChoicesNames = (choices: Choice[]) => {
        const result: string[] = [];
        choices.map((choice) => result.push(choice.name));
        return result
    };



    const formIsValid = values => {
        interface Errors {
            name:string | null,
            dates: string | null
            choices:string | null
            maxChoicesPerBallot:string|null
            registeredVoters:string|null
        }
        const errors :Errors = {
            name:null,
            dates:null,
            choices:null,
            maxChoicesPerBallot:null,
            registeredVoters:null
        };
        if (values.name==='') {
            errors.name = 'Le titre ne peut pas être vide';
        }
        if (values.dates.startsAt >= values.dates.endsAt) {
            errors.dates = "L'élection ne peut pas se terminer avant de commencer"
        }
        if (values.dates.endsAt < new Date()) {
            errors.dates = "L'élection ne peut pas être déjà terminée"
        }
        if (values.choices.includes("")) {
            errors.choices = 'Un choix ne peut pas être vide'
        }
        if (values.maxChoicesPerBallot < 1) {
            errors.maxChoicesPerBallot = 'Minimum 1'
        }
        if (values.registeredVoters.length < 0) {
            errors.registeredVoters = "Deux personnes au moins doivent être inscrites"
        }

        if (!errors.name && !errors.dates && !errors.choices && !errors.maxChoicesPerBallot && !errors.registeredVoters) {
            return {}
        }
        return errors;
    };


    const handleSubmit = (values, {setSubmitting}) => {
        const listOfChoicesNamesOnlyObject  = (names: string[]) => {
            const nameObjects : Object[] = [];
            names.map((name) => nameObjects.push({
                name: name
            }));
            return nameObjects
        };

        const newElection: Election = {
            name: values.name,
            association: association.id,
            choices: listOfChoicesNamesOnlyObject(values.choices),
            registeredVoters: values.registeredVoters,
            startsAt: values.dates.startsAt,
            endsAt: values.dates.endsAt,
            maxChoicesPerBallot: values.maxChoicesPerBallot,
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
            })
            .catch(err => {
                newToast({
                    message: err.message,
                    level: ToastLevel.Error,
                    delay: 2000
                });
            }).finally(() => setSubmitting(false));
    };

    return(
        <Formik
            initialValues={{
                name: election.name,
                registeredVoters: election.registeredVoters,
                choices: listOfChoicesNames(election.choices),
                dates: {startsAt: new Date(election.startsAt), endsAt: new Date(election.endsAt)},
                maxChoicesPerBallot: election.maxChoicesPerBallot,
                }}
            validate={formIsValid}
            onSubmit={handleSubmit}
        >
            {formik => (<form onSubmit={formik.handleSubmit} className={props.className}>
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ?
                        <Form.Control.Feedback type={'invalid'}>
                            {formik.errors.name}
                        </Form.Control.Feedback>
                        : null}
                </Form.Group>
                <Form.Row>
                    <DatesField
                        name={'dates'}
                    />
                </Form.Row>
                <Form.Row>
                    <Form.Group  className={'mt-1'}>
                        <h4>Choix</h4>
                        <div className={'small'}>
                            Pensez à ajouter un option pour le vote blanc si vous voulez le différencier de l'abstention.
                        </div>
                        <ChoicesField
                            name={'choices'}
                        />
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
                                        value={formik.values.maxChoicesPerBallot}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.maxChoicesPerBallot ? //no touched here
                                        <Form.Control.Feedback type='invalid'>
                                            {formik.errors.maxChoicesPerBallot}
                                        </Form.Control.Feedback>
                                        : null}
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
                                onClick={props.onDelete}
                            >
                                Supprimer
                            </Button> : <></>
                        }
                        <Button
                            variant="primary"
                            type="submit"
                        >
                            {props.edit? "Supprimer et remplacer":"Créer l'élection"}
                        </Button>
                    </Form.Group>
                </Form.Row>
            </form>
            )}
        </Formik>
    )
};

const ListOfChoices = props => {
    const list = props.choices.map((choice, k) =>
        <Col key={k}>
            <ChoiceInput
                id={k}
                onChange={(e) => props.onChange(e, k)}
                onDelete={() => props.onDelete(k)}
                onBlur={() => props.onBlur(k)}
                text={choice}
            />
        </Col>
    );


    return (list)
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
                onBlur={() => props.onBlur()}
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

const ChoicesField = (props) => {
    const [field, meta, helpers] = useField<string[]>(props);
    return (
        <Form.Group>
            <ListOfChoices
                choices={field.value}
                onChange={(e, k)=> {
                    const newChoicesState = field.value.slice();
                    newChoicesState[k] = e.target.value;
                    helpers.setValue(newChoicesState)
                }}
                onDelete={k => {
                    const newChoicesState = field.value.slice();
                    newChoicesState.splice(k,1);
                    helpers.setValue(newChoicesState)
                }}
                onBlur={() => helpers.setTouched(true)}
            />
            {meta.touched && meta.error ?
                <Form.Control.Feedback type='invalid'>
                    {meta.error}
                </Form.Control.Feedback>
                : null}
            <NewChoiceInputButton
                onClick={() => {
                    const newChoicesState = field.value.slice();
                    newChoicesState.push("");
                    helpers.setValue(newChoicesState)
                }}
            />
        </Form.Group>
    )
};


const DatesField = (props) => {
    const [field, meta] = useField<Dates>(props)
    return (
        <Form.Group className='mt-1'>
            <h4>Dates</h4>
            <Form.Row>
                <Col className={'ml-3'}>
                    <DateTimePickerField
                        label={'Début'}
                        name={'dates.startsAt'}
                        fromNow={false}
                    />
                </Col>
                <Col className={'ml-3'}>
                    <DateTimePickerField
                        label={"Fin"}
                        name={'dates.endsAt'}
                        fromNow={false}
                    />
                </Col>
            </Form.Row>
            {meta.error ?
                <Form.Control.Feedback type='invalid'>{meta.error}</Form.Control.Feedback>:null}
        </Form.Group>
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