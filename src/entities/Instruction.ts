import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RecipeInstruction } from './RecipeInstruction';
@Entity()
export class Instruction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  step!: string;

  @OneToMany(() => RecipeInstruction, (ri) => ri.instruction)
  recipeInstructions!: RecipeInstruction[];
  stepNumber!: number;
}
