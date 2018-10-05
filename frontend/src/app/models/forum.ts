import {User} from "./user";

export class Theme {
	id: string;
	name: string;
	description: string;
}

export class Topic {
	id: string;
	name: string;
	creator: User;
	theme: Theme;
	is_hidden_1A: boolean;
}

export class MessageForum{
	id: string;
	author: User;
	text: string;
	date: string;
	topic: Topic;
}
