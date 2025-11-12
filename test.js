// test.js
import OpenAI from 'openai';
import { OPENROUTER_API_KEY } from './config.js'; // This imports from config.js

// 1. Check if the key was loaded
if (!OPENROUTER_API_KEY) {
  console.error("--- ERROR ---");
  console.error("OPENROUTER_API_KEY is not loaded. Check your .env file and config.js");
  process.exit(1); // Stop the script
}

// 2. Configure the client to point to OpenRouter
// You defined 'llm', but the library is 'OpenAI'. Let's call it 'openrouter' to be clear.
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY, // Use the imported key
  defaultHeaders: {
    "HTTP-Referer": "https://docsquare.dev", // Optional
    "X-Title": "DocSquare Test", // Optional
  },
});

async function main() {
  try {
    console.log("Sending test request to OpenRouter with key starting with:", OPENROUTER_API_KEY.substring(0, 10));

    // 3. Call the chat completions 'create' method
    const completion = await openrouter.chat.completions.create({
      
      // 4. Specify the FREE model you want to test
      model: "google/gemma-3-12b-it:free", 
      
      messages: [
        {
          role: 'user',
          content: 'what is life? what happen after death?', // Simple test message
        },
      ],
    });

    // 5. If it works, print the successful response
    console.log("\n--- TEST SUCCESSFUL! ---");
    console.log("Response:", completion.choices[0].message.content);

  } catch (error) {
    console.error("\n--- TEST FAILED ---");
    // Check if it's the 401 Authentication Error
    if (error.status === 401) {
      console.error("You are still getting a 401 Authentication Error.");
      console.error("This means your OPENROUTER_API_KEY in the .env file is invalid.");
      console.error("Go to https://openrouter.ai/keys, create a NEW key, and paste it into .env");
    } else {
      // Log any other error
      console.error("Error message:", error.message);
    }
  }
}

// 6. Run the main function
main();