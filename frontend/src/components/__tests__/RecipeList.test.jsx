import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RecipeList from '../RecipeList';
import * as recipeApi from '../../services/recipeApi';

// Mock the API calls
vi.mock('../../services/recipeApi', () => ({
  getAllRecipes: vi.fn(),
}));

describe('RecipeList', () => {
  const mockRecipes = [
    {
      id: '1',
      title: 'Test Recipe 1',
      description: 'Desc 1',
      imageUrl: null,
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: 'easy',
      category: 'dinner',
      tags: [],
      rating: 3,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: [{ name: 'Ingredient A', amount: '1', unit: 'cup', order: 1 }],
      instructions: [],
    },
    {
      id: '2',
      title: 'Test Recipe 2',
      description: 'Desc 2',
      imageUrl: null,
      prepTime: 15,
      cookTime: 25,
      servings: 2,
      difficulty: 'medium',
      category: 'lunch',
      tags: [],
      rating: 5,
      isFavorite: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: [{ name: 'Ingredient B', amount: '2', unit: 'oz', order: 1 }],
      instructions: [],
    },
  ];

  beforeEach(() => {
    recipeApi.getAllRecipes.mockClear();
  });

  it('should display loading state initially', () => {
    recipeApi.getAllRecipes.mockReturnValueOnce(new Promise(() => {})); // Never resolves
    render(
      <Router>
        <RecipeList />
      </Router>
    );
    expect(screen.getByText(/Loading recipes.../i)).toBeInTheDocument();
  });

  it('should display recipes after fetching', async () => {
    recipeApi.getAllRecipes.mockResolvedValueOnce(mockRecipes);
    render(
      <Router>
        <RecipeList />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Test Recipe 1')).toBeInTheDocument());
    expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
    expect(recipeApi.getAllRecipes).toHaveBeenCalledWith(''); // Initial call without search term
  });

  it('should display error message if fetching fails', async () => {
    const errorMessage = 'Failed to fetch recipes';
    recipeApi.getAllRecipes.mockRejectedValueOnce(new Error(errorMessage));
    render(
      <Router>
        <RecipeList />
      </Router>
    );

    await waitFor(() => expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument());
  });

  it('should display "No recipes found" if no recipes are returned', async () => {
    recipeApi.getAllRecipes.mockResolvedValueOnce([]);
    render(
      <Router>
        <RecipeList />
      </Router>
    );

    await waitFor(() => expect(screen.getByText(/No recipes found./i)).toBeInTheDocument());
  });

  // Test search functionality
  it('should call getAllRecipes with search term when SearchBar input changes', async () => {
    // Initial mock for the first render
    recipeApi.getAllRecipes.mockResolvedValueOnce(mockRecipes);
    render(
      <Router>
        <RecipeList />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Test Recipe 1')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search recipes by title or ingredient.../i);

    // Mock for the subsequent call when search term changes
    recipeApi.getAllRecipes.mockResolvedValueOnce([mockRecipes[0]]); // Mock a filtered result

    fireEvent.change(searchInput, { target: { value: 'chicken' } });

    // Wait for the debounced search to trigger and API to be called with the new term
    await waitFor(() => expect(recipeApi.getAllRecipes).toHaveBeenCalledWith('chicken'), {
      timeout: 1000,
    });
    // Also verify that the UI updates with the filtered result
    await waitFor(() => expect(screen.getByText('Test Recipe 1')).toBeInTheDocument());
    expect(screen.queryByText('Test Recipe 2')).not.toBeInTheDocument();
  });
});
