"use client";

import React, { useState } from "react";

type Recipe = {
  ingredients: string[];
  extra_ingredients: string[];
  instructions: string[];
};

type GeneratedRecipesProps = {
  recipe: string | null;
};

const GeneratedRecipes: React.FC<GeneratedRecipesProps> = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!recipe) {
    return <p>No recipe generated yet.</p>;
  }

  let parsedRecipe: Recipe;
  
  try {
    parsedRecipe = JSON.parse(recipe);
  } catch (error) {
    return <p>Error parsing recipe.</p>;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border rounded p-4 m-2 cursor-pointer" onClick={toggleExpand}>
      <h3>{parsedRecipe.ingredients[0]}</h3> {/* Assuming the first ingredient as the name */}
      {isExpanded && (
        <div className="mt-2">
          <h4>Ingredients:</h4>
          <ul>
            {parsedRecipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h4>Extra Ingredients:</h4>
          <ul>
            {parsedRecipe.extra_ingredients.map((extraIngredient, index) => (
              <li key={index}>{extraIngredient}</li>
            ))}
          </ul>
          <h4>Instructions:</h4>
          <ol>
            {parsedRecipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default GeneratedRecipes;
