export type RolePermission =
    | "administration"
    | "election"
    | "event"
    | "media"
    | "library"
    | "marketplace"
    | "page";

export interface Role {
    id: number;
    association: { id: string; name: string; logo?: string };
    role: string;
    rank: number;
    startDate: Date;
    endDate: Date;
    permissions: RolePermission[];
}
