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
        Can you suggest four different recipes using only these ingredients and specify any additional ingredients separately?
        - For each recipe, please clearly separate the ingredients I provided from any extra ingredients needed.
        - Please provide the exact measurements for each ingredient. Dont mention the mesurement in the instructions section.
        - Maximum number of steps for each recipe is 8.
        - Please be very careful with the json format dont add any additional information, follow the example (just prroide the JSON format). 
        - Provide each recipe in a JSON format as follows:
        [
          {
            "recipe_name": "Recipe 1",
            "ingredients": ["ingredient1 - measurement", "ingredient2 - measurement"],
            "extra_ingredients": ["extra_ingredient1 - measurement", "extra_ingredient2 - measurement"],
            "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
          },
          {
            "recipe_name": "Recipe 2",
            "ingredients": ["ingredient1 - measurement", "ingredient2 - measurement"],
            "extra_ingredients": ["extra_ingredient1 - measurement", "extra_ingredient2 - measurement"],
            "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
          },
          ....
        ]
        - Ensure that only the ingredients I provided are listed under "ingredients".
        - Please only provide the text in the specified format, without additional explanations.
        `;
        

        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo-instruct",
            prompt,
            max_tokens: 2000,
        });

        const data = await response.json(); // Parse the JSON response
        // const recipe = data.choices[0].text.trim(); // Extract the recipe text

        console.log('Generated recipe:', data.choices[0].text);


        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });

    }
}

