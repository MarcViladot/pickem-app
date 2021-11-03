import { UserGroup } from "../../group/entities/user-group.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Round } from "../../round/entities/round.entity";
import { RoundResult } from "../../match/entities/round-result.entity";

@Entity()
export class LeagueType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logo: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => UserGroup)
  @JoinTable()
  groups: [];

  @OneToMany(() => Round, round => round.league)
  rounds: Round[];

  @OneToMany(() => RoundResult, roundResult => roundResult.league)
  roundResults: RoundResult[];


}
