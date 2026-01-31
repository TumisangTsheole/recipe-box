import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipes/${recipe.id}`} className="block">
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white hover:shadow-xl transition-shadow duration-300">
        {recipe.imageUrl && (
          <img className="w-full h-48 object-cover" src={recipe.imageUrl} alt={recipe.title} />
        )}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-gray-800">{recipe.title}</div>
          <p className="text-gray-700 text-base">
            {recipe.description?.substring(0, 100)}
            {recipe.description?.length > 100 ? '...' : ''}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {recipe.category}
          </span>
          {recipe.tags &&
            recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min
          </div>
          {recipe.rating && (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  data-testid={i < recipe.rating ? 'star-filled' : 'star-empty'}
                  className={`w-4 h-4 ${i < recipe.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.695h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.695l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
