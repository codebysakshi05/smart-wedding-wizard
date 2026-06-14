/**
 * controllers/export.controller.js
 * Handles PDF generation and public sharing of wedding plans.
 */

const SavedPlan = require("../models/SavedPlan");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const mongoose = require("mongoose");

/**
 * GET /api/export-plan/:id
 * Generates a professional PDF document of the wedding plan.
 */
const exportPlanToPDF = async (req, res) => {
  const { id } = req.params;

  try {
    let planData;

    // Check if DB is connected
    if (mongoose.connection.readyState !== 1 && id.startsWith("mock-")) {
      // Return a sample plan if DB is down and it's a mock ID
      planData = getSamplePlanData();
    } else {
      planData = await SavedPlan.findById(id);
    }

    if (!planData && id.startsWith("mock-")) {
      planData = getSamplePlanData();
    }

    if (!planData) {
      return res.status(404).json(formatErrorResponse("Plan not found"));
    }

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=wedding-plan-${id}.pdf`);

    doc.pipe(res);

    // --- Header ---
    doc.fontSize(25).text("Dream Weaver AI", { align: "center", color: "#6366f1" });
    doc.moveDown();
    doc.fontSize(18).text(`Your Wedding Plan: ${planData.theme}`, { align: "center" });
    doc.moveDown(2);

    // --- Core Details ---
    doc.fontSize(14).text("Plan Overview", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Theme: ${planData.theme}`);
    doc.text(`Budget: â‚¹${planData.budget.toLocaleString("en-IN")}`);
    doc.text(`Guests: ${planData.guests}`);
    doc.moveDown();

    // --- Plan Breakdown ---
    doc.fontSize(14).text("Wedding Details", { underline: true });
    doc.moveDown(0.5);

    const plan = planData.plan;
    if (plan.venue) {
      doc.fontSize(12).text(`Venue: ${plan.venue.name || "N/A"}`, { bold: true });
      doc.fontSize(10).text(plan.venue.description || "");
      doc.moveDown(0.5);
    }

    if (plan.decor) {
      doc.fontSize(12).text(`Decor: ${plan.decor.style || "N/A"}`, { bold: true });
      doc.fontSize(10).text(`Palette: ${plan.decor.palette || "N/A"}`);
      doc.moveDown(0.5);
    }

    if (plan.catering) {
      doc.fontSize(12).text(`Catering: ${plan.catering.style || "N/A"}`, { bold: true });
      doc.fontSize(10).text(plan.catering.description || "");
      doc.moveDown(0.5);
    }

    // --- Budget Breakdown ---
    if (plan.budgetBreakdown) {
      doc.moveDown();
      doc.fontSize(14).text("Budget Allocation", { underline: true });
      doc.moveDown(0.5);
      Object.entries(plan.budgetBreakdown).forEach(([item, amount]) => {
        doc.fontSize(10).text(`${item}: â‚¹${Number(amount).toLocaleString("en-IN")}`);
      });
    }

    // --- Images ---
    if (planData.images && planData.images.length > 0) {
      doc.addPage();
      doc.fontSize(14).text("Visual Inspiration", { underline: true });
      doc.moveDown();

      // We only try to add the first few images to keep it simple and avoid timeouts
      for (const imageUrl of planData.images.slice(0, 3)) {
        try {
          if (imageUrl.startsWith("/")) {
            const fs = require("fs");
            const path = require("path");
            const localPath = path.join(__dirname, "..", "..", "public", imageUrl);
            if (fs.existsSync(localPath)) {
              doc.image(localPath, { fit: [500, 300], align: "center", valign: "center" });
              doc.moveDown(2);
            } else {
              console.warn("[PDFExport] Local file not found:", localPath);
            }
          } else {
            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
            doc.image(response.data, { fit: [500, 300], align: "center", valign: "center" });
            doc.moveDown(2);
          }
        } catch (imgError) {
          console.warn("[PDFExport] Could not fetch image:", imageUrl, imgError.message);
        }
      }
    }

    doc.end();
  } catch (error) {
    console.error("[ExportController] PDF generation error:", error.message);
    return res.status(500).json(formatErrorResponse("Failed to generate PDF."));
  }
};

/**
 * GET /api/share-plan/:id
 * Public endpoint to share a plan (no sensitive data).
 */
const sharePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await SavedPlan.findById(id).select("theme plan budget images guests");

    if (!plan) {
      return res.status(404).json(formatErrorResponse("Shared plan not found"));
    }

    return res.status(200).json(formatSuccessResponse("Shared plan retrieved", plan));
  } catch (error) {
    console.error("[ExportController] Share error:", error.message);
    return res.status(500).json(formatErrorResponse("Could not retrieve shared plan"));
  }
};

/**
 * Helper for fallback sample data.
 */
function getSamplePlanData() {
  return {
    theme: "Royal Heritage Fallback",
    budget: 2000000,
    guests: 100,
    images: ["/assets/assets/decor/royal/royal1.jpg"],
    plan: {
      venue: { name: "Sample Palace", description: "A majestic fallback venue." },
      decor: { style: "Traditional", palette: "Gold" },
      budgetBreakdown: { Venue: 1000000, Catering: 500000, Decor: 300000, Misc: 200000 },
    },
  };
}

module.exports = {
  exportPlanToPDF,
  sharePlan,
};
