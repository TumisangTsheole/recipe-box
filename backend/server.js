const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory data store for simplicity (will be replaced by database later)
let recipes = [
  {
    id: uuidv4(),
    title: 'Classic Chocolate Chip Cookies',
    description: 'Chewy and delicious homemade cookies',
    imageUrl: null,
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'easy',
    category: 'dessert',
    tags: ['dessert', 'baking', 'comfort-food'],
    rating: 4,
    ingredients: [
      { id: uuidv4(), name: 'all-purpose flour', amount: '2.25', unit: 'cups', order: 1 },
      { id: uuidv4(), name: 'butter', amount: '1', unit: 'cup', order: 2 },
      { id: uuidv4(), name: 'chocolate chips', amount: '2', unit: 'cups', order: 3 },
    ],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Mix butter and sugars until creamy',
      'Add eggs and vanilla, beat well',
      'Combine dry ingredients separately',
      'Gradually blend into butter mixture',
      'Stir in chocolate chips',
      'Drop by rounded tablespoons onto cookie sheets',
      'Bake 9-11 minutes until golden brown',
    ],
    notes: 'Great with a glass of milk!',
    isFavorite: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Spicy Chicken Stir-Fry',
    description: 'A quick and flavorful weeknight meal',
    imageUrl: null,
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    category: 'dinner',
    tags: ['spicy', 'quick', 'asian'],
    rating: 5,
    ingredients: [
      { id: uuidv4(), name: 'chicken breast', amount: '1.5', unit: 'lb', order: 1 },
      { id: uuidv4(), name: 'broccoli florets', amount: '3', unit: 'cups', order: 2 },
      { id: uuidv4(), name: 'soy sauce', amount: '1/4', unit: 'cup', order: 3 },
      { id: uuidv4(), name: 'sriracha', amount: '1', unit: 'tbsp', order: 4 },
    ],
    instructions: [
      'Slice chicken and vegetables',
      'Heat oil in a large skillet or wok',
      'Stir-fry chicken until cooked through',
      'Add vegetables and cook until tender-crisp',
      'Whisk together soy sauce and sriracha, add to pan',
      'Serve hot over rice',
    ],
    notes: null,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Middleware
app.use(express.json()); // for parsing application/json
app.use(cors()); // Enable CORS for all origins (for now)

// Routes
const API_BASE = '/api/v1';

// GET all recipes (with optional search)
app.get(`${API_BASE}/recipes`, (req, res) => {
  const { q } = req.query;
  let filteredRecipes = recipes;

  if (q) {
    const searchTerm = q.toLowerCase();
    filteredRecipes = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(searchTerm))
    );
  }
  res.json(filteredRecipes);
});

// GET single recipe by ID
app.get(`${API_BASE}/recipes/:id`, (req, res) => {
  const { id } = req.params;
  const recipe = recipes.find((r) => r.id === id);

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

// POST create new recipe
app.post(`${API_BASE}/recipes`, (req, res) => {
  const {
    title,
    description,
    prepTime,
    cookTime,
    servings,
    difficulty,
    category,
    tags,
    ingredients,
    instructions,
    notes,
    isFavorite,
    rating,
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newRecipe = {
    id: uuidv4(),
    title,
    description: description || null,
    imageUrl: null,
    prepTime: prepTime || 0,
    cookTime: cookTime || 0,
    servings: servings || 1,
    difficulty: difficulty || 'easy',
    category: category || 'lunch', // Default category
    tags: tags || [],
    rating: rating || null,
    ingredients: ingredients ? ingredients.map((ing) => ({ id: uuidv4(), ...ing })) : [],
    instructions: instructions || [],
    notes: notes || null,
    isFavorite: isFavorite || false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// PUT update recipe
app.put(`${API_BASE}/recipes/:id`, (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    prepTime,
    cookTime,
    servings,
    difficulty,
    category,
    tags,
    ingredients,
    instructions,
    notes,
    isFavorite,
    rating,
  } = req.body;

  const recipeIndex = recipes.findIndex((r) => r.id === id);

  if (recipeIndex > -1) {
    const updatedRecipe = {
      ...recipes[recipeIndex],
      title: title || recipes[recipeIndex].title,
      description: description || recipes[recipeIndex].description,
      prepTime: prepTime || recipes[recipeIndex].prepTime,
      cookTime: cookTime || recipes[recipeIndex].cookTime,
      servings: servings || recipes[recipeIndex].servings,
      difficulty: difficulty || recipes[recipeIndex].difficulty,
      category: category || recipes[recipeIndex].category,
      tags: tags || recipes[recipeIndex].tags,
      rating: rating || recipes[recipeIndex].rating,
      ingredients: ingredients
        ? ingredients.map((ing) => ({ id: ing.id || uuidv4(), ...ing }))
        : recipes[recipeIndex].ingredients,
      instructions: instructions || recipes[recipeIndex].instructions,
      notes: notes || recipes[recipeIndex].notes,
      isFavorite: isFavorite !== undefined ? isFavorite : recipes[recipeIndex].isFavorite,
      updatedAt: new Date(),
    };
    recipes[recipeIndex] = updatedRecipe;
    res.json(updatedRecipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

// DELETE recipe
app.delete(`${API_BASE}/recipes/:id`, (req, res) => {
  const { id } = req.params;
  const initialLength = recipes.length;
  recipes = recipes.filter((r) => r.id !== id);

  if (recipes.length < initialLength) {
    res.status(204).send(); // No Content
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Access recipes at http://localhost:${PORT}${API_BASE}/recipes`);
  });
}

module.exports = app;
module.exports.recipes = recipes; // Export recipes for testing purposes (to reset state)
