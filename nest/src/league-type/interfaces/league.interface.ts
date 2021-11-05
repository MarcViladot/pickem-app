export interface ClassificationTableInfo {
  byRounds: any;
  global: GroupedTableByUser[];
}

export interface GroupedTableByUser {
  userId: number;
  totalPoints: number;
}
