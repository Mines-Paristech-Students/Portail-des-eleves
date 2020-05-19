export interface SidebarOption {
    notifyChange: (object) => {};
    sections: {
        title: string;
        id: string;
        retractable: boolean;
        props?: object;
        fields: (SidebarOptionCheckField | SidebarOptionInputField)[];
    }[];
}

interface SidebarOptionField {
    type: string;
    id: string;
    label: string;
    defaultValue?: any;
}

export interface SidebarOptionInputField extends SidebarOptionField {
    type: "text";
    defaultValue?: string;
    placeholder: string;
}

export interface SidebarOptionCheckField extends SidebarOptionField {
    type: "checkbox";
    defaultValue?: boolean;
}
