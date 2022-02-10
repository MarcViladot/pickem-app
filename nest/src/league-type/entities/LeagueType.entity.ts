import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Round } from "../../round/entities/round.entity";
import { RoundResult } from "../../match/entities/round-result.entity";
import { Group } from "src/group/entities/group.entity";

@Entity()
export class LeagueType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logo: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Group)
  @JoinTable()
  groups: [];

  @OneToMany(() => Round, round => round.league)
  rounds: Round[];

  @OneToMany(() => RoundResult, roundResult => roundResult.league)
  roundResults: RoundResult[];

  @Column({default: false})
  visible: boolean;


}
