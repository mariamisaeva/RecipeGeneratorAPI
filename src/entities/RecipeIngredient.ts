import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe';
import { Ingredient } from './Ingredient';

@Entity()
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Recipe, (r) => r.ingredients, { onDelete: 'CASCADE' }) //rows in this table are removed when a recipe is deleted
  recipe!: Recipe;

  @ManyToOne(() => Ingredient, (i) => i.recipeIngredients) //no cascade-delete ingredients to prevent accidental deletion
  ingredient!: Ingredient;

  @Column('decimal', { precision: 10, scale: 2 }) // 10 digits in total, 2 after the decimal point
  quantity!: number;

  @Column()
  unit!: string;

  @Column()
  indexNumber!: number;
}

// Joint table between Recipe and Ingredient
// RecipeIngredient: id, recipeId, ingredientId, quantity, unit
// + ManyToOne relationship with Recipe and Ingredient
// recipeId, ingredientId: Foreign keys are generated by TypeORM automatically
