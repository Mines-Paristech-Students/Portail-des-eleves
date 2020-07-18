import { RolePermission } from "./role";

export interface Association {
  id: string;
  name: string;
  logo: string;
  marketplace_enabled: boolean;
  library_enabled: boolean;
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
