import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ default: 1 })
  servings!: number;

  @Column()
  time!: string;

  @Column({ default: 'no-image.png' })
  image!: string;

  @Column({ default: 'other' })
  category!: string;

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe)
  recipeIngredients!: RecipeIngredient[];

  @ManyToMany(() => Instruction, (step) => step.recipes)
  @JoinTable()
  instructions!: Instruction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn();
  updatedAt!: Date;

  @Column()
  author!: string;
}

//createdAt: Date;
//updatedAt: Date;
