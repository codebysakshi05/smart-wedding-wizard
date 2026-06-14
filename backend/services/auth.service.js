/**
 * services/auth.service.js
 *
 * Business logic for user registration and authentication.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * Generates a JWT token for a given user ID.
 * @param {string} userId
 * @returns {string} JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Registers a new user.
 * @param {object} param0
 * @param {string} param0.name
 * @param {string} param0.email
 * @param {string} param0.password
 * @returns {Promise<{ user: object, token: string }>}
 */
const register = async ({ name, email, password }) => {
  // Demo Mode Fallback: If DB is disconnected, return a mock user
  if (mongoose.connection.readyState !== 1) {
    console.warn("[AuthService] Database disconnected. Returning mock user for demo.");
    const mockId = "mock-user-123";
    return {
      user: { id: mockId, name: name || "Demo User", email },
      token: generateToken(mockId),
    };
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

/**
 * Authenticates an existing user.
 * @param {object} param0
 * @param {string} param0.email
 * @param {string} param0.password
 * @returns {Promise<{ user: object, token: string }>}
 */
const login = async ({ email, password }) => {
  // Demo Mode Fallback: If DB is disconnected, allow any login
  if (mongoose.connection.readyState !== 1) {
    console.warn("[AuthService] Database disconnected. Allowing demo login.");
    const mockId = "mock-user-123";
    return {
      user: { id: mockId, name: "Demo User", email },
      token: generateToken(mockId),
    };
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

module.exports = {
  register,
  login,
};
