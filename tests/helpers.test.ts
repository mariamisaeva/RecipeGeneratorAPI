import { AppDataSource } from '../src/config/database';
import {
  handleIngredients,
  handleInstructions,
  handleUpdateIngredients,
  handleUpdateInstructions,
} from '../src/utils/helpers';
import { Recipe } from '../src/entities/Recipe';
import { Ingredient } from '../src/entities/Ingredient';
import { Instruction } from '../src/entities/Instruction';
import { RecipeIngredient } from '../src/entities/RecipeIngredient';
import { RecipeInstruction } from '../src/entities/RecipeInstruction';

jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('handleIngredients Function', () => {
  let mockIngredientsRepository: any;
  let mockRecipeIngredientRepository: any;

  beforeEach(() => {
    mockIngredientsRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockRecipeIngredientRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockIngredientsRepository)
      .mockImplementationOnce(() => mockRecipeIngredientRepository);
  });

  it('should create and save new ingredients and return RecipeIngredient array', async () => {
    const mockRecipe = { id: 1 } as Recipe;
    const mockIngredients = [
      {
        quantity: 1,
        unit: 'cup',
        ingredient: { name: 'Flour' },
      },
      {
        quantity: 2,
        unit: 'tbsp',
        ingredient: { name: 'Sugar' },
      },
    ];

    const mockSavedIngredient1 = { id: 1, name: 'Flour' };
    const mockSavedIngredient2 = { id: 2, name: 'Sugar' };
    const mockRecipeIngredient1 = { id: 1, ingredient: mockSavedIngredient1 };
    const mockRecipeIngredient2 = { id: 2, ingredient: mockSavedIngredient2 };

    mockIngredientsRepository.findOneBy
      .mockResolvedValueOnce(null) // Flour not found
      .mockResolvedValueOnce(null); // Sugar not found

    mockIngredientsRepository.create
      .mockImplementationOnce(() => mockSavedIngredient1)
      .mockImplementationOnce(() => mockSavedIngredient2);

    mockIngredientsRepository.save
      .mockResolvedValueOnce(mockSavedIngredient1)
      .mockResolvedValueOnce(mockSavedIngredient2);

    mockRecipeIngredientRepository.create
      .mockImplementationOnce(() => mockRecipeIngredient1)
      .mockImplementationOnce(() => mockRecipeIngredient2);

    mockRecipeIngredientRepository.save
      .mockResolvedValueOnce(mockRecipeIngredient1)
      .mockResolvedValueOnce(mockRecipeIngredient2);

    const result = await handleIngredients(mockIngredients, mockRecipe);

    expect(result).toEqual([mockRecipeIngredient1, mockRecipeIngredient2]);
    expect(mockIngredientsRepository.findOneBy).toHaveBeenCalledTimes(2);
    expect(mockIngredientsRepository.create).toHaveBeenCalledTimes(2);
    expect(mockIngredientsRepository.save).toHaveBeenCalledTimes(2);
    expect(mockRecipeIngredientRepository.create).toHaveBeenCalledTimes(2);
    expect(mockRecipeIngredientRepository.save).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if ingredient name is missing', async () => {
    const mockRecipe = { id: 1 } as Recipe;
    const mockIngredients = [
      {
        quantity: 1,
        unit: 'cup',
        ingredient: { name: '' }, // Missing name
      },
    ];

    await expect(
      handleIngredients(mockIngredients, mockRecipe),
    ).rejects.toThrow('Ingredient name is required.');
  });

  it('should reuse existing ingredients if found in the repository', async () => {
    const mockRecipe = { id: 1 } as Recipe;
    const mockIngredients = [
      {
        quantity: 1,
        unit: 'cup',
        ingredient: { name: 'Flour' },
      },
    ];

    const mockExistingIngredient = { id: 1, name: 'Flour' };
    const mockRecipeIngredient = { id: 1, ingredient: mockExistingIngredient };

    mockIngredientsRepository.findOneBy.mockResolvedValueOnce(
      mockExistingIngredient,
    );

    mockRecipeIngredientRepository.create.mockImplementationOnce(
      () => mockRecipeIngredient,
    );

    mockRecipeIngredientRepository.save.mockResolvedValueOnce(
      mockRecipeIngredient,
    );

    const result = await handleIngredients(mockIngredients, mockRecipe);

    expect(result).toEqual([mockRecipeIngredient]);
    expect(mockIngredientsRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockIngredientsRepository.create).not.toHaveBeenCalled();
    expect(mockIngredientsRepository.save).not.toHaveBeenCalled();
    expect(mockRecipeIngredientRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRecipeIngredientRepository.save).toHaveBeenCalledTimes(1);
  });
});

//HandleInstructions
describe('handleInstructions Function', () => {
  let mockInstructionsRepository: any;
  let mockRecipeInstructionRepository: any;

  beforeEach(() => {
    mockInstructionsRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockRecipeInstructionRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockInstructionsRepository)
      .mockImplementationOnce(() => mockRecipeInstructionRepository);
  });

  it('should create and save new instructions and return RecipeInstruction array', async () => {
    const mockRecipe = { id: 1 } as Recipe;
    const mockInstructions = [
      { instruction: { step: 'Step 1' }, stepNumber: 1 },
      { instruction: { step: 'Step 2' }, stepNumber: 2 },
    ];

    const mockSavedInstruction1 = { id: 1, step: 'Step 1' };
    const mockSavedInstruction2 = { id: 2, step: 'Step 2' };

    const mockRecipeInstruction1 = {
      id: 1,
      instruction: mockSavedInstruction1,
    };
    const mockRecipeInstruction2 = {
      id: 2,
      instruction: mockSavedInstruction2,
    };

    mockInstructionsRepository.findOneBy
      .mockResolvedValueOnce(null) // Step 1 not found
      .mockResolvedValueOnce(null); // Step 2 not found

    mockInstructionsRepository.create
      .mockImplementationOnce(() => mockSavedInstruction1)
      .mockImplementationOnce(() => mockSavedInstruction2);

    mockInstructionsRepository.save
      .mockResolvedValueOnce(mockSavedInstruction1)
      .mockResolvedValueOnce(mockSavedInstruction2);

    mockRecipeInstructionRepository.create
      .mockImplementationOnce(() => mockRecipeInstruction1)
      .mockImplementationOnce(() => mockRecipeInstruction2);

    mockRecipeInstructionRepository.save
      .mockResolvedValueOnce(mockRecipeInstruction1)
      .mockResolvedValueOnce(mockRecipeInstruction2);

    const result = await handleInstructions(mockInstructions, mockRecipe);

    expect(result).toEqual([mockRecipeInstruction1, mockRecipeInstruction2]);
    expect(mockInstructionsRepository.findOneBy).toHaveBeenCalledTimes(2);
    expect(mockInstructionsRepository.create).toHaveBeenCalledTimes(2);
    expect(mockInstructionsRepository.save).toHaveBeenCalledTimes(2);
    expect(mockRecipeInstructionRepository.create).toHaveBeenCalledTimes(2);
    expect(mockRecipeInstructionRepository.save).toHaveBeenCalledTimes(2);
  });

  it('should reuse existing instructions if found in the repository', async () => {
    const mockRecipe = { id: 1 } as Recipe;
    const mockInstructions = [
      { instruction: { step: 'Step 1' }, stepNumber: 1 },
    ];

    const mockExistingInstruction = { id: 1, step: 'Step 1' };
    const mockRecipeInstruction = {
      id: 1,
      instruction: mockExistingInstruction,
    };

    mockInstructionsRepository.findOneBy.mockResolvedValueOnce(
      mockExistingInstruction,
    );

    mockRecipeInstructionRepository.create.mockImplementationOnce(
      () => mockRecipeInstruction,
    );

    mockRecipeInstructionRepository.save.mockResolvedValueOnce(
      mockRecipeInstruction,
    );

    const result = await handleInstructions(mockInstructions, mockRecipe);

    expect(result).toEqual([mockRecipeInstruction]);
    expect(mockInstructionsRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockInstructionsRepository.create).not.toHaveBeenCalled();
    expect(mockInstructionsRepository.save).not.toHaveBeenCalled();
    expect(mockRecipeInstructionRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRecipeInstructionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if instruction step is missing', async () => {
    const mockRecipe = { id: 1 } as Recipe;
    const mockInstructions = [
      { instruction: { step: '' }, stepNumber: 1 }, // Empty step
    ];

    await expect(
      handleInstructions(mockInstructions, mockRecipe),
    ).rejects.toThrow('Instruction step is required.');
  });
});

//HandleUpdateIngredients
describe('handleUpdateIngredients Function', () => {
  let mockIngredientsRepository: any;
  let mockRecipeIngredientRepository: any;

  beforeEach(() => {
    mockIngredientsRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockRecipeIngredientRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      find: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockIngredientsRepository)
      .mockImplementationOnce(() => mockRecipeIngredientRepository);
  });

  it('should update existing ingredients and add new ones', async () => {
    const mockRecipe = {
      id: 1,
      ingredients: [{ id: 1, ingredient: { name: 'Salt' } }],
    } as any;

    const mockIngredients = [
      { id: 1, quantity: 2, unit: 'tsp', ingredient: { id: 1, name: 'Salt' } },
      { quantity: 1, unit: 'tbsp', ingredient: { name: 'Sugar' } },
    ];

    const mockUpdatedIngredient = {
      id: 1,
      quantity: 2,
      unit: 'tsp',
      ingredient: { id: 1, name: 'Salt' },
    };

    const mockNewIngredient = { id: 2, name: 'Sugar' };
    const mockNewRecipeIngredient = {
      id: 2,
      ingredient: mockNewIngredient,
      quantity: 1,
      unit: 'tbsp',
    };

    mockIngredientsRepository.findOneBy
      .mockResolvedValueOnce({ id: 1, name: 'Salt' }) // Mock existing ingredient
      .mockResolvedValueOnce(null); // Mock new ingredient

    mockIngredientsRepository.create.mockReturnValue(mockNewIngredient);
    mockIngredientsRepository.save.mockResolvedValue(mockNewIngredient);

    mockRecipeIngredientRepository.findOne.mockResolvedValueOnce(
      mockUpdatedIngredient,
    );

    mockRecipeIngredientRepository.create.mockReturnValue(
      mockNewRecipeIngredient,
    );
    mockRecipeIngredientRepository.save
      .mockResolvedValueOnce(mockUpdatedIngredient)
      .mockResolvedValueOnce(mockNewRecipeIngredient);

    // Mock `find` to return the updated ingredients
    mockRecipeIngredientRepository.find.mockResolvedValueOnce([
      mockUpdatedIngredient,
      mockNewRecipeIngredient,
    ]);

    const result = await handleUpdateIngredients(mockIngredients, mockRecipe);

    expect(result).toEqual([mockUpdatedIngredient, mockNewRecipeIngredient]);

    // expect(mockIngredientsRepository.findOneBy).toHaveBeenCalledTimes(2);
    expect(mockRecipeIngredientRepository.save).toHaveBeenCalledTimes(2);
    expect(mockRecipeIngredientRepository.find).toHaveBeenCalledWith({
      where: { recipe: { id: mockRecipe.id } },
      relations: ['ingredient'],
    });
  });

  it('should throw an error if ingredient name or id is missing', async () => {
    const mockRecipe = { id: 1, ingredients: [] } as any;

    const mockIngredients = [
      { quantity: 1, unit: 'tbsp', ingredient: { name: '' } },
    ];

    await expect(
      handleUpdateIngredients(mockIngredients, mockRecipe),
    ).rejects.toThrow('Ingredient name or id is required');
  });

  it('should remove excluded ingredients', async () => {
    const mockRecipe = {
      id: 1,
      ingredients: [
        { id: 1, ingredient: { name: 'Salt' } },
        { id: 2, ingredient: { name: 'Pepper' } },
      ],
    } as any;

    const mockIngredients = [
      { id: 1, quantity: 2, unit: 'tsp', ingredient: { id: 1, name: 'Salt' } },
    ];

    const mockUpdatedIngredient = {
      id: 1,
      quantity: 2,
      unit: 'tsp',
      ingredient: { id: 1, name: 'Salt' },
    };

    mockRecipeIngredientRepository.findOne.mockResolvedValueOnce(
      mockUpdatedIngredient,
    );
    mockRecipeIngredientRepository.save.mockResolvedValueOnce(
      mockUpdatedIngredient,
    );
    mockRecipeIngredientRepository.remove.mockResolvedValueOnce(undefined);

    const result = await handleUpdateIngredients(mockIngredients, mockRecipe);

    expect(result).toEqual([mockUpdatedIngredient]);
    expect(mockRecipeIngredientRepository.remove).toHaveBeenCalledWith([
      { id: 2, ingredient: { name: 'Pepper' } },
    ]);
  });
});
