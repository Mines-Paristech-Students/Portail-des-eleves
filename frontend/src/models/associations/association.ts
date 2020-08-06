import { RolePermission } from "./role";

export interface Association {
  id: string;
  name: string;
  logo: string;
  enabledModules: "marketplace" | "library"[];
  rank: number;
  myRole?: {
    id: string;
    role: string;
    rank: number;
    startDate: Date;
    endDate?: Date;
    permissions: RolePermission[];
  };
}
