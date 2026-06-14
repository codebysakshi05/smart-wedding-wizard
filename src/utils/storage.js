/**
 * Dream Weaver AI â€” Client-Side Local Storage Manager
 * Handles local synchronization, unique IDs, timestamps, and robust caching
 */

const LOCAL_PLANS_KEY = "dream_weaver_local_plans";
const SAVED_IMAGES_KEY = "dream_weaver_saved";
const SAVED_VENDORS_KEY = "saved_vendors";

/**
 * Get all saved wedding plans from local storage
 * @returns {Array} Array of saved plan objects
 */
export function getWeddingPlans() {
  try {
    const plansStr = localStorage.getItem(LOCAL_PLANS_KEY);
    if (!plansStr) return [];
    const parsed = JSON.parse(plansStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading wedding plans from localStorage:", err);
    return [];
  }
}

/**
 * Save a new wedding plan
 * @param {Object} planData Input fields, generated timeline, and selected vendors
 * @returns {Object|null} The saved plan object or null if failed
 */
export function saveWeddingPlan(planData) {
  try {
    const plans = getWeddingPlans();

    // Fetch current favorites to snapshot along with the plan
    let currentInspirations = [];
    try {
      const savedImgs = localStorage.getItem(SAVED_IMAGES_KEY);
      if (savedImgs) currentInspirations = JSON.parse(savedImgs);
    } catch (e) {}

    let currentVendors = [];
    try {
      const savedVends = localStorage.getItem(SAVED_VENDORS_KEY);
      if (savedVends) currentVendors = JSON.parse(savedVends);
    } catch (e) {}

    const timestamp = new Date().toISOString();
    const newPlan = {
      _id:
        planData._id ||
        planData.id ||
        "plan_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      createdAt: planData.createdAt || timestamp,
      updatedAt: timestamp,

      // Inputs & State
      religion: planData.religion || "Hindu",
      state: planData.state || "Rajasthan",
      city: planData.city || "Udaipur",
      budget: Number(planData.budget) || 1500000,
      guests: Number(planData.guests) || 150,
      theme: planData.theme || "Royal Traditional",
      priorities: Array.isArray(planData.priorities) ? planData.priorities : [],

      // Core generated components
      plan: planData.plan || {
        summary: {
          religion: planData.religion || "Hindu",
          location: planData.state || "Rajasthan",
          themeName: planData.theme || "Royal Traditional",
          totalBudget: Number(planData.budget) || 1500000,
          guests: Number(planData.guests) || 150,
        },
        events: planData.events || [],
      },

      // Selected favorites & shortlists snapshot
      selectedVenues: planData.selectedVenues || currentVendors,
      selectedServices: planData.selectedServices || currentVendors,
      savedInspirations: planData.savedInspirations || currentInspirations,
      images: planData.images || [
        planData.events?.[0]?.decorImage || "/assets/assets/decor/royal/royal1.jpg",
      ],
    };

    // Prevent duplicates by ID
    const updatedPlans = plans.filter((p) => p._id !== newPlan._id);
    updatedPlans.push(newPlan);

    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(updatedPlans));
    return newPlan;
  } catch (err) {
    console.error("Error writing wedding plan to localStorage:", err);
    return null;
  }
}

/**
 * Update properties on an existing plan
 * @param {string} id Unique plan ID
 * @param {Object} updatedFields Map of properties to merge into the plan
 * @returns {Object|null} The updated plan object or null if failed
 */
export function updateWeddingPlan(id, updatedFields) {
  try {
    const plans = getWeddingPlans();
    const index = plans.findIndex((p) => p._id === id);
    if (index === -1) {
      console.warn(`Plan with ID ${id} not found to update.`);
      return null;
    }

    const currentPlan = plans[index];
    const timestamp = new Date().toISOString();

    const updatedPlan = {
      ...currentPlan,
      ...updatedFields,
      updatedAt: timestamp,
      // Keep plan summary sync'ed if core values update
      plan: {
        ...currentPlan.plan,
        ...(updatedFields.plan || {}),
        summary: {
          ...currentPlan.plan?.summary,
          religion: updatedFields.religion || currentPlan.religion,
          location: updatedFields.state || currentPlan.state,
          totalBudget: Number(updatedFields.budget) || currentPlan.budget,
          guests: Number(updatedFields.guests) || currentPlan.guests,
          themeName: updatedFields.theme || currentPlan.theme,
          ...(updatedFields.plan?.summary || {}),
        },
      },
    };

    plans[index] = updatedPlan;
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(plans));
    return updatedPlan;
  } catch (err) {
    console.error(`Error updating plan ID ${id}:`, err);
    return null;
  }
}

/**
 * Delete a specific wedding plan
 * @param {string} id Unique plan ID to remove
 * @returns {boolean} True if deletion succeeded, false otherwise
 */
export function deleteWeddingPlan(id) {
  try {
    const plans = getWeddingPlans();
    const updatedPlans = plans.filter((p) => p._id !== id);
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(updatedPlans));
    return true;
  } catch (err) {
    console.error(`Error deleting plan ID ${id}:`, err);
    return false;
  }
}
