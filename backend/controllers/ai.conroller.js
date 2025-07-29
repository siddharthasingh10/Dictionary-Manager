// controllers/aiController.js
const Word = require("../models/word.model");
const Workspace = require("../models/workspace.model");
const UserPrompt = require("../models/prompt.model");
const axios = require('axios');

// Middleware to check daily prompt limit
const checkPromptLimit = async (req, res, next) => {
  const userId = req.body.userId;
  const today = new Date().toDateString();

  try {
    let usage = await UserPrompt.findOne({ userId });

    if (!usage) {
      req.usage = new UserPrompt({ userId, promptCount: 0, lastPromptDate: today });
      return next();
    }

    const lastUsed = new Date(usage.lastPromptDate).toDateString();

    if (lastUsed === today && usage.promptCount >= 1) {
      return res.status(403).json({ message: "Daily AI usage limit reached" });
    }

    req.usage = usage;
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Prompt limit check failed" });
  }
};

// Ask AI for word suggestions
const askAi = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.id;
  console.log("Prompt:", prompt, "| User ID:", userId);

  const COHERE_API_KEY = process.env.COHERE_API_KEY;

  const coherePrompt = `
You are an advanced English vocabulary generator. Your response must be ONLY a valid JSON array containing exactly 1 vocabulary words.
DO NOT include any additional text, explanations, or formatting outside the JSON array.
DO NOT use markdown code blocks or any other formatting around the JSON.

Format requirements:
- Array must contain exactly 10 items
- Each item must have: word, definition, example, and level
- level must be one of: Easy, Medium, or Hard
- No trailing commas
- Perfect JSON syntax

Example of required format:
[
  {
    "word": "Aberration",
    "definition": "A deviation from the norm.",
    "example": "The sudden drop in temperature was an aberration.",
    "level": "Medium"
  }
]

Now generate 10 words for: "${prompt}"
`;

  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: coherePrompt,
        max_tokens: 600,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let generatedText = response.data.generations?.[0]?.text?.trim();
    console.log("AI Response:", generatedText);

    if (!generatedText) {
      return res.status(500).json({ message: "Empty response from AI" });
    }

    // Clean the response to extract just the JSON
    generatedText = generatedText
      .replace(/```json/g, '')  // Remove JSON code block markers
      .replace(/```/g, '')      // Remove any other code block markers
      .trim();

    // Find the first [ and last ] to extract the JSON array
    const startIndex = generatedText.indexOf('[');
    const endIndex = generatedText.lastIndexOf(']') + 1;
    
    if (startIndex === -1 || endIndex === -1) {
      console.error("No JSON array found in response");
      return res.status(500).json({ message: "AI response format invalid" });
    }

    let words;
    try {
      const jsonString = generatedText.slice(startIndex, endIndex);
      console.log("Extracted JSON String:", jsonString);
      words = JSON.parse(jsonString);
      console.log("Parsed Words:", words);
    } catch (err) {
      console.error("JSON Parsing Error:", err.message);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    // Validate the response structure
    if (!Array.isArray(words) || words.length !== 10 || 
        !words.every(item => item.word && item.definition && item.example && item.level)) {
      console.error("Invalid array structure");
      return res.status(500).json({ message: "AI response format invalid" });
    }

    console.log("✅ Parsed Words:", words);
    return res.status(200).json({ success: true, data: words });

  } catch (err) {
    console.error("Cohere API Error:", err.response?.data || err.message);
    return res.status(500).json({ message: "AI failed to respond properly" });
  }
};


// Accept word from AI and store
const acceptWord = async (req, res) => {
  const {
    author,
    workspace,
    word,
    definition,
    example,
    level,
  } = req.body;

  try {
    const newWord = new Word({
      author,
      workspace,
      word,
      definition,
      example,
      level: level || "Easy",
      status: "Not remembered",
    });

    await newWord.save();

    await Workspace.findByIdAndUpdate(workspace, {
      $push: { words: newWord._id },
    });

    res.status(201).json({ success: true, word: newWord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save word" });
  }
};

// Discard word (no save)
const discardWord = async (req, res) => {
  const { word } = req.body;
  console.log("User discarded:", word);
  res.status(200).json({ success: true, message: "Word discarded" });
};
module.exports = {
  checkPromptLimit,
    askAi,
    acceptWord,
    discardWord,
};