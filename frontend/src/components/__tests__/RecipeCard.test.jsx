import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RecipeCard from '../RecipeCard';

// Mock the uuid module for consistent test IDs
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('RecipeCard', () => {
  const mockRecipe = {
    id: '1',
    title: 'Chocolate Cake',
    description: 'Delicious chocolate cake recipe',
    imageUrl: 'http://example.com/cake.jpg',
    prepTime: 20,
    cookTime: 30,
    servings: 8,
    difficulty: 'medium',
    category: 'dessert',
    tags: ['sweet', 'baking'],
    rating: 4,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ingredients: [],
    instructions: [],
  };

  it('should render recipe information correctly', () => {
    render(
      <Router>
        <RecipeCard recipe={mockRecipe} />
      </Router>
    );

    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.getByText(/Delicious chocolate cake recipe/i)).toBeInTheDocument();
    expect(screen.getByAltText('Chocolate Cake')).toHaveAttribute(
      'src',
      'http://example.com/cake.jpg'
    );
    expect(screen.getByText('dessert')).toBeInTheDocument();
    expect(screen.getByText('#sweet')).toBeInTheDocument();
    expect(screen.getByText('#baking')).toBeInTheDocument();
    expect(screen.getByText(/Prep: 20 min/i)).toBeInTheDocument();
    expect(screen.getByText(/Cook: 30 min/i)).toBeInTheDocument();

    // Check for rating stars (assuming 4 filled stars for rating 4)
    const filledStars = screen.getAllByTestId('star-filled');
    expect(filledStars).toHaveLength(4);
  });

  it('should link to the recipe detail page', () => {
    render(
      <Router>
        <RecipeCard recipe={mockRecipe} />
      </Router>
    );

    const linkElement = screen.getByRole('link', { name: /chocolate cake/i }); // Adjust name based on actual content
    expect(linkElement).toHaveAttribute('href', `/recipes/${mockRecipe.id}`);
  });

  it('should render default image when imageUrl is null', () => {
    const recipeWithoutImage = { ...mockRecipe, imageUrl: null };
    render(
      <Router>
        <RecipeCard recipe={recipeWithoutImage} />
      </Router>
    );
    expect(screen.queryByAltText('Chocolate Cake')).not.toBeInTheDocument();
  });
});
