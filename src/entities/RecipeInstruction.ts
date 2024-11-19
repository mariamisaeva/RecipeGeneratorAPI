import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe';
import { Instruction } from './Instruction';

@Entity()
export class RecipeInstruction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  stepNumber!: number;

  @ManyToOne(() => Recipe, (r) => r.recipeInstructions)
  recipe!: Recipe;

  @ManyToOne(() => Instruction, (i) => i.recipeInstructions)
  instruction!: Instruction;
}
