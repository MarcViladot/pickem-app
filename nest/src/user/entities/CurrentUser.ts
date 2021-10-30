import { UserGroup, UserRole as GroupRole } from "../../group/entities/user-group.entity";
import { User, UserRole } from "./user.entity";

export class CurrentUser {
  name: string;
  email: string;
  photo: string;
  userRole: UserRole;
  token?: string;
  groups: UserGroup[];
  invitations: UserGroup[];

  constructor(api: User) {
    this.name = api.name;
    this.email = api.email;
    this.photo = api.photo ? api.photo : `https://eu.ui-avatars.com/api/?background=random&name=${this.name.split(' ').slice(0, 2).join('+')}`;
    this.userRole = api.userRole;
    this.token = api.token;
    this.groups = api.userGroups.filter(userGroup => userGroup.userRole !== GroupRole.PENDING)
    this.invitations = api.userGroups.filter(userGroup => userGroup.userRole === GroupRole.PENDING)
  }
}
