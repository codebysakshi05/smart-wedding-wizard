// Quick functional test for wedding planner service
const {
  generateWeddingPlan,
  distributeBudget,
} = require("./backend/services/weddingPlanner.service");

async function runTests() {
  console.log("\n============ BUDGET ENGINE TEST ============");
  const b1 = distributeBudget(150000);
  console.log("1.5L budget:", JSON.stringify(b1.formatted, null, 2), "| Tier:", b1.tier);

  const b2 = distributeBudget(1000000);
  console.log("10L budget:", JSON.stringify(b2.formatted, null, 2), "| Tier:", b2.tier);

  const b3 = distributeBudget(5000000);
  console.log("50L budget:", JSON.stringify(b3.formatted, null, 2), "| Tier:", b3.tier);

  console.log("\n============ HINDU PLAN (RAJASTHAN, ROYAL) ============");
  try {
    const hinduPlan = await generateWeddingPlan({
      budget: 1000000,
      religion: "hindu",
      guests: 500,
      state: "Rajasthan",
      theme: "royal",
      weddingDate: "2025-11-15",
    });
    console.log("Summary:", JSON.stringify(hinduPlan.summary, null, 2));
    console.log("Budget:", JSON.stringify(hinduPlan.budget.formatted, null, 2));
    console.log("Events count:", hinduPlan.events.length);
    console.log("Timeline days:", hinduPlan.timeline.length);
    console.log("Primary Venue:", hinduPlan.primaryVenue?.name, "-", hinduPlan.primaryVenue?.state);
    console.log("Decor theme:", hinduPlan.decor.decor?.theme);
    console.log(
      "Catering vendors:",
      hinduPlan.vendors.catering.map((v) => v.name),
    );

    console.log("\n============ MUSLIM PLAN (DELHI, TRADITIONAL) ============");
    const muslimPlan = await generateWeddingPlan({
      budget: 600000,
      religion: "muslim",
      guests: 300,
      state: "Delhi",
      theme: "traditional",
    });
    console.log(
      "Events:",
      muslimPlan.events.map((e) => e.name),
    );
    console.log("Venue:", muslimPlan.primaryVenue?.name, "| Tier:", muslimPlan.budget.tier);
    console.log("Decor theme:", muslimPlan.decor.decor?.theme);

    console.log("\n============ SOUTH INDIAN PLAN (TAMIL NADU, TRADITIONAL) ============");
    const southIndianPlan = await generateWeddingPlan({
      budget: 1500000,
      religion: "south_indian",
      guests: 400,
      state: "Tamil Nadu",
      theme: "traditional",
    });
    console.log(
      "Events:",
      southIndianPlan.events.map((e) => e.name),
    );
    console.log(
      "Venue:",
      southIndianPlan.primaryVenue?.name,
      "| Tier:",
      southIndianPlan.budget.tier,
    );
    console.log("Decor Theme:", southIndianPlan.decor.decor?.theme);
    console.log("Groom outfit:", southIndianPlan.dress.recommendations?.groom);

    console.log("\n✅ All tests passed!");
  } catch (err) {
    console.error("❌ Test failed:", err.message, err.stack);
  }
}

runTests();
