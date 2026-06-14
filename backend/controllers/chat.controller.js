/**
 * controllers/chat.controller.js
 * HTTP layer for the POST /api/chat endpoint.
 */

const chatService = require("../services/chat.service");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");
const { validationResult } = require("../utils/validators");

/**
 * POST /api/chat
 *
 * Body  : { message: string, history: array }
 * Returns: { response: string }
 */
const chat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrorResponse("Validation failed", errors.array()));
  }

  const { message, history = [] } = req.body;

  try {
    const startMs = Date.now();
    const { reply, source, reason } = await chatService.generateChatResponse(message, history);
    const durationMs = Date.now() - startMs;

    return res
      .status(200)
      .json(
        formatSuccessResponse(
          "Chat response generated successfully",
          { response: reply },
          { source, reason, durationMs },
        ),
      );
  } catch (error) {
    console.error("[ChatController] Error:", error.message);

    const statusCode = error.statusCode || 500;
    const userMessage =
      statusCode === 401
        ? "Invalid OpenAI API key. Please check your .env configuration."
        : statusCode === 429
          ? "OpenAI rate limit reached. Please wait and try again."
          : statusCode === 502
            ? "Could not reach the AI service. Please try again shortly."
            : error.message || "An unexpected error occurred";

    return res.status(statusCode).json(formatErrorResponse(userMessage));
  }
};

module.exports = { chat };
