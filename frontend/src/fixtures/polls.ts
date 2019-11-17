import {Choice, Poll, PollState} from "../models/polls";

const choices_1: Choice[] = [
    {
        id: "1",
        text: "C’est de la merde.",
    },
    {
        id: "2",
        text: "C’est VRAIMENT de la merde.",
    }
];

export const poll_1: Poll = {
    id: "1",
    choices: choices_1,
    question: "Le nouveau portail ?",
    state: PollState.Accepted,
    creationDateTime: new Date(2019, 11, 1),
    publicationDate: new Date(2019, 11, 9),
    adminComment: "",
    isActive: true
};


const choices_2: Choice[] = [
    {
        id: "3",
        text: "17cantelobre",
        numberOfVotes: 45,
    },
    {
        id: "4",
        text: "17bocquet",
        numberOfVotes: 45,
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
        id: "5",
        text: "Zaza",
        numberOfVotes: 54,
    },
    {
        id: "6",
        text: "Mazière",
        numberOfVotes: 38
    }
];

export const poll_3: Poll = {
    id: "3",
    choices: choices_3,
    question: "Le plus claqueur ?",
    state: PollState.Accepted,
    creationDateTime: new Date(2019, 11, 1),
    publicationDate: new Date(2019, 11, 7),
    adminComment: "",
    isActive: false
};

const choices_4: Choice[] = [
    {
        id: "7",
        text: "Bla bla bla",
        numberOfVotes: 54,
    },
    {
        id: "8",
        text: "Bla bla bla",
        numberOfVotes: 38
    }
];

export const poll_4: Poll = {
    id: "4",
    choices: choices_4,
    question: "Sondage nul",
    state: PollState.Rejected,
    creationDateTime: new Date(2019, 11, 1),
    publicationDate: new Date(2019, 11, 7),
    adminComment: "",
    isActive: false
};

const choices_5: Choice[] = [
    {
        id: "9",
        text: "Bla bla bla",
        numberOfVotes: 54,
    },
    {
        id: "10",
        text: "Bla bla bla",
        numberOfVotes: 38
    }
];

export const poll_5: Poll = {
    id: "5",
    choices: choices_5,
    question: "Sondage en attente",
    state: PollState.Reviewing,
    creationDateTime: new Date(2019, 11, 1),
    publicationDate: new Date(2019, 11, 7),
    adminComment: "",
    isActive: false
};


export const polls = [poll_1, poll_2, poll_3, poll_4, poll_5];