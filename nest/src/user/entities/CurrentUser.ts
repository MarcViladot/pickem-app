import { UserGroup, UserRole as GroupRole } from "../../group/entities/user-group.entity";
import { User, UserRole } from "./user.entity";

export class CurrentUser {
  id: number;
  name: string;
  photo: string;
  userRole: UserRole;
  createdAt: Date;
  token?: string;
  groups: UserGroup[];
  // invitations: UserGroup[];

  constructor(api: User, token?: string) {
    this.id = api.id;
    this.name = api.name;
    this.photo = api.photo;
    this.createdAt = api.createdAt;
    this.userRole = api.userRole;
    this.token = token ? token : api.token;
    this.groups = api.userGroups.filter(userGroup => userGroup.userRole !== GroupRole.PENDING)
    // this.invitations = api.userGroups.filter(userGroup => userGroup.userRole === GroupRole.PENDING)
  }
}
