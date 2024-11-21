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
  name: string;
  quantity: number;
  unit: string;
}

export interface Instruction_TS {
  stepNumber: number;
  step: string;
}
