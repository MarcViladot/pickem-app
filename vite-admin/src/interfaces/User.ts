export interface User {
  id: number;
  uid: number;
  email: string;
  photo: string;
  name: string;
  token: string;
  userRole: UserRole;
  userGroups?: UserGroup[];
  firebaseUser?: FirebaseUser;
}

interface FirebaseUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  disabled: boolean;
  metadata: UserMetadata;
}

interface UserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
}

export interface UserGroup {
  id: number;
  userRole: UserGroupRole;
  group: Group;
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

export interface UserResult {
  parsedUsers: User[];
  nextPageToken: string;
}
