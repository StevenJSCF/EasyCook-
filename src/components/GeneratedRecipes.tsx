import React, { useState } from "react";

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
    
    return <p>No recipe generated yet.</p>;
  }

  let parsedRecipes: Recipe[];

  try {
    parsedRecipes = JSON.parse(recipe);
  } catch (error) {
    return <p>Error parsing recipes.</p>;
  }

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="w-full h-full relative">
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {parsedRecipes.map((parsedRecipe, index) => (
          <div
            key={index}
            className="border rounded p-4 cursor-pointer w-full h-full"
            onClick={() => openModal(parsedRecipe)}
          >
            <h3>{parsedRecipe.recipe_name}</h3>
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <Modal isOpen={!!selectedRecipe} onClose={closeModal}>
          <h2 className="text-center mb-4 font-bold">{selectedRecipe.recipe_name}</h2>
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
              <h4 className = "font-bold">Extra Ingredients:</h4>
              <ul className="list-disc pl-6">
                {selectedRecipe.extra_ingredients.map((extraIngredient, idx) => (
                  <li key={idx}>{extraIngredient}</li>
                ))}
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

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-800 opacity-75" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg z-10 max-w-lg w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export default GeneratedRecipes;
