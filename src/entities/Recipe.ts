import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Instruction } from './Instruction';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: false })
  isVegetarian!: boolean;

  @Column()
  time!: string;

  @Column({ default: 1 })
  servings!: number;

  @Column({ default: 'no-image.png' })
  image!: string;

  @Column({ default: 'other' })
  category!: string;

  @Column()
  author!: string;

  @Column()
  ingredients!: string;

  @ManyToMany(() => Instruction, (step) => step.recipes)
  //   @JoinTable()
  instructions!: Instruction[];
}
