import {Choice, Poll, PollState} from "../models/polls";

const choices_1: Choice[] = [
    {
        id: "1",
        text: "Piche",
    },
    {
        id: "2",
        text: "Skema",
    }
];

export const poll_1: Poll = {
    id: "1",
    choices: choices_1,
    question: "Tu préfères ?",
    state: PollState.Accepted,
    creationDateTime: new Date(2019, 11, 1),
    publicationDate: new Date(2019, 11, 9),
    adminComment: "",
    isActive: true
};


const choices_2: Choice[] = [
    {
        id: "1",
        text: "17cantelobre",
    },
    {
        id: "2",
        text: "17bocquet",
    }
];

export const poll_2: Poll = {
    id: "2",
    choices: choices_2,
    question: "Le plus beau ?",
    state: PollState.Accepted,
    creationDateTime: new Date(2019, 11, 1),
    publicationDate: new Date(2019, 11, 8),
    adminComment: "",
    isActive: false
};

const choices_3: Choice[] = [
    {
        id: "1",
        text: "Zaza",
    },
    {
        id: "2",
        text: "Mazière",
    }
];

export const poll_3: Poll = {
    id: "3",
    choices: choices_2,
    question: "Le plus claqueur ?",
    state: PollState.Accepted,
    creationDateTime: new Date(2019, 11, 1),
    publicationDate: new Date(2019, 11, 7),
    adminComment: "",
    isActive: false
};


export const polls = [poll_1, poll_2, poll_3];