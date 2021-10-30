export interface User {
  id: number;
  email: string;
  photo: string;
  name: string;
  token: string;
  userRole: UserRole;
  userGroups?: UserGroup[];
  groups?: UserGroup[];
}

export interface UserGroup {
  id: number;
  userRole: UserGroupRole;
  group: Group;
  leagues: LeagueType[]
}

export interface LeagueType {
  id: number;
  name: string;
  logo: string;
}

export interface Group {
  id: number;
  name: string;
  photo: string;
  invitationCode: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface CreateUser {
  email: string;
  password: string;
}

export enum UserRole {
  MEMBER = 0,
  ADMIN = 1
}

export enum UserGroupRole {
  MEMBER = 0,
  ADMIN = 1,
  OWNER = 2,
  PENDING = 3,
}

export interface UserCredentials {
  email: string;
  password: string;
}
