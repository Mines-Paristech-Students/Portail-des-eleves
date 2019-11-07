export enum StudentType {
    AST = "AST",
    ISUPFERE = "ISUPFERE",
    EV = "EV",
    IC = "IC"
}

export class User {
    constructor(public first_name: string,
                public last_name: string,
                public birthday: string,
                public email: string,
                public yearOfEntry: number,
                public studentType: StudentType,
                public isActive: boolean,
                public isAdmin: boolean,
                public nickname: string,
                public phone: string,
                public room: string,
                public address: string,
                public cityOfOrigin: string,
                public option: string,
                public sports: string,
                public roommate: User,
                public minesparent: User[]) {

    }
}
