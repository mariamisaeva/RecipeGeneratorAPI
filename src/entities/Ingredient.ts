import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Recipe } from './Recipe';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
