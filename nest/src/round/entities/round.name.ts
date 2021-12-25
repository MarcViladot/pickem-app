import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeagueType } from "../../league-type/entities/LeagueType.entity";
import { TranslationGroup } from "./translation.group";

@Entity()
export class RoundName {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  text: string;

  @Column()
  lang: string;

  @ManyToOne(() => TranslationGroup, translationGroup => translationGroup.id)
  @JoinColumn({name: 'translationGroupId'})
  translationGroup?: number;

  @Column()
  translationGroupId: number;

}
