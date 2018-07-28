export class User {

    id: string;
    first_name: string;
    last_name : string;

    email: string;

    nickname?: string;
    birthday?: string;

    phone?: string;

    room?: string;
    address?: string;
    city_of_origin?: string;

    option?: string;
    is_ast?: boolean;
    is_isupfere?: boolean;
    is_in_gapyear?: boolean;

    sports?: string;
    roommate?: User;
    minesparent?: User;

    is_active?: boolean;
    is_admin?: boolean;


}
