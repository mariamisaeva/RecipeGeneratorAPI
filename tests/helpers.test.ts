import { AppDataSource } from '../src/config/database';
import { handleIngredients } from '../src/utils/helpers';
import { Recipe } from '../src/entities/Recipe';
import { Ingredient } from '../src/entities/Ingredient';
import { RecipeIngredient } from '../src/entities/RecipeIngredient';

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
