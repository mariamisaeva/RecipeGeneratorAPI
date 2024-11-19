import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Recipe } from './Recipe';

@Entity()
export class Instruction {
  @PrimaryGeneratedColumn()
  id!: number;

  //   @Column()
  //   stepNumber!: number;

  @Column()
  step!: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.instructions)
  recipes!: Recipe[];
}
