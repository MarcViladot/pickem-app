import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoundName } from "./round.name";
import { Match } from "../../match/entities/match.entity";

@Entity()
export class TranslationGroup {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  @OneToMany(() => RoundName, roundName => roundName.translationGroup,{eager: true})
  roundNames: RoundName[];

}
