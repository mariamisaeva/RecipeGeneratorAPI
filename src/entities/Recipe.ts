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

  @Column({ default: 1 })
  servings!: number;

  @Column()
  time!: string;

  @Column({ default: 'no-image.png' })
  image!: string;

  @Column({ default: 'other' })
  category!: string;

  @Column()
  author!: string;

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe)
  @ManyToMany(() => Instruction, (step) => step.recipes)
  @JoinTable()
  instructions!: Instruction[];
}

//createdAt: Date;
//updatedAt: Date;
