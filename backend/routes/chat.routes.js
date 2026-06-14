/**
 * routes/chat.routes.js
 * Exposes the chatbot endpoint.
 *
 * POST /api/chat
 *   Body: { message }
 */

const { Router } = require("express");
const { validateChatRequest } = require("../utils/validators");
const chatController = require("../controllers/chat.controller");

const router = Router();

/**
 * POST /api/chat
 * Send a message to the wedding planner AI assistant.
 */
router.post("/chat", validateChatRequest, chatController.chat);

module.exports = router;
