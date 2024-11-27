export interface Recipe_TS {
  title: string;
  description?: string;
  isVegetarian: boolean;
  servings: number;
  time: string;
  image?: string;
  category?: string;
  ingredients: Ingredient_TS[];
  instructions: Instruction_TS[];
}

export interface Ingredient_TS {
  id?: number;
  ingredient: { id: number; name: string };
  quantity: number;
  unit: string;
  //   indexNumber: number;
}

export interface Instruction_TS {
  id?: number;
  stepNumber: number;
  instruction: { id: number; step: string };
}
