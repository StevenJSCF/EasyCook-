// GeneratedRecipes.tsx
import React, { useState } from "react";
import Modal from './Modal';  // Adjust the import path as necessary

type Recipe = {
  recipe_name: string;
  ingredients: string[];
  extra_ingredients: string[];
  instructions: string[];
};

type GeneratedRecipesProps = {
  recipe: string | null;
};

const GeneratedRecipes: React.FC<GeneratedRecipesProps> = ({ recipe }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (!recipe) {
    return <p>No recipes generated</p>;
  }

  let parsedRecipes: Recipe[];

  try {
    parsedRecipes = JSON.parse(recipe);
  } catch (error) {
    return <p>There was an error generating the recipes.</p>;
  }

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="w-full h-full relative">
      <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
        {parsedRecipes.map((parsedRecipe, index) => (
          <div
            key={index}
            className="border-2 border-gray-300 rounded-lg cursor-pointer w-full h-full p-4 shadow-lg hover:shadow-xl transition-shadow duration-200"
            onClick={() => openModal(parsedRecipe)}
          >
            <h3 className="text-xl font-bold">{parsedRecipe.recipe_name}</h3>
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <Modal isOpen={!!selectedRecipe} onClose={closeModal}>
          <h2 className="text-center mb-4 font-bold">
            {selectedRecipe.recipe_name}
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex-1">
              <h4 className="font-bold">Ingredients:</h4>
              <ul className="list-disc pl-6">
                {selectedRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Extra Ingredients:</h4>
              <ul className="list-disc pl-6">
                {selectedRecipe.extra_ingredients.map(
                  (extraIngredient, idx) => (
                    <li key={idx}>{extraIngredient}</li>
                  )
                )}
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Instructions:</h4>
              <ol className="list-decimal pl-6">
                {selectedRecipe.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GeneratedRecipes;
