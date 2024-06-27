import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
    const { ingredients } = await req.json();

    console.log("Debugging ingredients: ", ingredients);

    try {
      const prompt = `
      You are a professional cook. I have the following ingredients: ${ingredients.join(", ")}. 
      Can you suggest a recipe using only these ingredients and specify any additional ingredients separately?
      - For the recipe, please clearly separate the ingredients I provided from any extra ingredients needed. Also please provide the exact mesurements for each ingredient.
      - Provide the ingredients, extra ingredients, and instructions in a JSON format.
      - Ensure that only the ingredients I provided are listed under "ingredients".
      - Example:
      {
        "ingredients": ["ingredient1", "ingredient2"],
        "extra_ingredients": ["extra_ingredient1", "extra_ingredient2"],
        "instructions": "Step 1: ..."
      }
      `;
      

        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo-instruct",
            prompt,
            max_tokens: 150,
        });

        const data = await response.json(); // Parse the JSON response
        // const recipe = data.choices[0].text.trim(); // Extract the recipe text

        console.log('Generated recipe:', data);

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });

    }
}

