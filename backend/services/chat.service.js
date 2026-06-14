/**
 * services/chat.service.js
 *
 * OpenAI integration for the chatbot endpoint.
 * Responds as an expert wedding planner assistant.
 * Includes a fallback mechanism for when the API key is not present.
 */

const OpenAI = require("openai");
const { withTimeout } = require("../utils/timeout");

/* ─── Client ─────────────────────────────────────────────────── */

let openaiClient = null;

const getClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

/* ─── System Prompt ──────────────────────────────────────────── */

const SYSTEM_PROMPT = `
You are Dream Weaver, an elite wedding consultant and planner.
You have years of experience planning all types of weddings across different budgets and cultures.

Your goal is to guide the user through their wedding journey.
CRITICAL RULES:
1. Respond like a professional wedding consultant—be warm, reassuring, and highly knowledgeable.
2. ALWAYS provide actionable suggestions, tips, or creative ideas instead of just giving direct, plain answers.
3. Keep your responses structured, helpful, and polite. Do not use excessive markdown, but bullet points are encouraged.
`.trim();

/* ─── Public API ─────────────────────────────────────────────── */

/**
 * Sends a message to GPT-4o-mini and returns the assistant's conversational reply.
 *
 * @param {string} message - The user's chat message
 * @param {Array<{role: string, content: string}>} [history=[]] - Previous conversation history
 * @returns {Promise<string>} - The assistant's reply
 */
const generateChatResponse = async (message, history = []) => {
  const client = getClient();

  if (!client) {
    console.warn("[Chat Service] No OPENAI_API_KEY – returning mock chat response.");
    return { reply: getMockChatResponse(message), source: "mock", reason: "no_api_key" };
  }

  try {
    // Trim history to prevent token overload (keep last 8 messages max)
    const trimmedHistory = history.slice(-8);

    // Only map allowed fields to prevent arbitrary injection
    const formattedHistory = trimmedHistory.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...formattedHistory,
      { role: "user", content: message },
    ];

    const chatPromise = client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const completion = await withTimeout(chatPromise, 10000);

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) throw new Error("Empty response from OpenAI");

    return { reply, source: "ai" };
  } catch (err) {
    if (err.isTimeout) {
      console.warn("[Chat Service] Request timed out. Returning mock chat response.");
      return { reply: getMockChatResponse(message), source: "mock", reason: "timeout" };
    }
    const statusCode = err.status || err.statusCode;
    const enhanced = new Error(`OpenAI error: ${err.message}`);
    enhanced.statusCode = statusCode === 401 ? 401 : statusCode === 429 ? 429 : 502;
    throw enhanced;
  }
};

/* ─── Mock Fallback ──────────────────────────────────────────── */

/**
 * Returns a simple mock response based on keywords in the user's message.
 *
 * @param {string} message
 * @returns {string}
 */
const getMockChatResponse = (message) => {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("budget") || lowerMsg.includes("cost")) {
    return "When it comes to your budget, I always recommend prioritizing what's most important to you (like photography or food) and allocating your funds there first. Always keep a 10-15% contingency buffer!";
  }

  if (lowerMsg.includes("venue") || lowerMsg.includes("location")) {
    return "Choosing a venue is such an exciting step! I'd recommend touring at least 3-4 options in your desired area. Think about capacity, lighting, and what's included in their packages before making a decision.";
  }

  if (lowerMsg.includes("theme") || lowerMsg.includes("style")) {
    return "Your theme sets the tone for the entire day. Whether it's a rustic boho garden party or a luxurious royal setup, we can pick a color palette and decor that reflects your unique love story.";
  }

  return "Hello! I am your Dream Weaver wedding planner assistant. How can I help you make your special day absolutely perfect?";
};

module.exports = { generateChatResponse };
