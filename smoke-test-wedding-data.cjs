// Smoke test for public/wedding-data engines
const path = require("path");
const base = path.join(__dirname, "public/wedding-data");

console.log("\n=== WEDDING DATA SMOKE TEST ===\n");

// 1. Verify all data files parse correctly
const dataFiles = [
  "venues",
  "events",
  "religions",
  "styles",
  "budgets",
  "food",
  "outfits",
  "makeup",
  "jewelry",
  "photographers",
  "decorators",
  "services",
  "recommendations",
];
console.log("--- Data Files ---");
let dataOK = 0;
dataFiles.forEach((f) => {
  try {
    const d = require(`${base}/data/${f}.json`);
    const count = Array.isArray(d) ? d.length : Object.keys(d).length;
    console.log(`  ✅ ${f}.json (${count} top-level entries)`);
    dataOK++;
  } catch (e) {
    console.log(`  ❌ ${f}.json — ${e.message}`);
  }
});

// 2. Verify all engine files load
const engineFiles = [
  "budgetEngine",
  "venueMatcher",
  "religionFlowEngine",
  "styleEngine",
  "foodEngine",
  "outfitEngine",
  "makeupEngine",
  "jewelryEngine",
  "photographerEngine",
  "decoratorEngine",
  "imageSelectorEngine",
  "weddingPlannerEngine",
];
console.log("\n--- Engine Files ---");
let engOK = 0;
engineFiles.forEach((f) => {
  try {
    require(`${base}/engine/${f}.js`);
    console.log(`  ✅ ${f}.js`);
    engOK++;
  } catch (e) {
    console.log(`  ❌ ${f}.js — ${e.message}`);
  }
});

// 3. Run engine logic
console.log("\n--- Engine Logic Tests ---");
try {
  const { distributeBudget } = require(`${base}/engine/budgetEngine`);
  const b = distributeBudget(1000000);
  console.log(
    `  ✅ budgetEngine: ₹10L → tier=${b.tier}, venue=${b.formatted.venue}, catering=${b.formatted.catering}`,
  );
} catch (e) {
  console.log(`  ❌ budgetEngine: ${e.message}`);
}

try {
  const { matchVenues } = require(`${base}/engine/venueMatcher`);
  const v = matchVenues({
    location: "Rajasthan",
    budget: "premium",
    guests: 500,
    religion: "hindu",
  });
  console.log(`  ✅ venueMatcher: ${v.length} venues → top: ${v[0]?.name}`);
} catch (e) {
  console.log(`  ❌ venueMatcher: ${e.message}`);
}

try {
  const { getEventFlow } = require(`${base}/engine/religionFlowEngine`);
  const ev = getEventFlow("muslim");
  console.log(
    `  ✅ religionFlowEngine: muslim → ${ev.length} events: ${ev.map((e) => e.name).join(", ")}`,
  );
} catch (e) {
  console.log(`  ❌ religionFlowEngine: ${e.message}`);
}

try {
  const { resolveStyle } = require(`${base}/engine/styleEngine`);
  const s = resolveStyle("royal", "hindu", "premium");
  console.log(`  ✅ styleEngine: ${s.label} — ${s.decor.mandapStyle}`);
} catch (e) {
  console.log(`  ❌ styleEngine: ${e.message}`);
}

try {
  const { buildMenu } = require(`${base}/engine/foodEngine`);
  const m = buildMenu("south-indian", "mid", 300);
  console.log(
    `  ✅ foodEngine: ${m.liveStations.length} live stations, desserts: ${m.desserts.slice(0, 2).join(", ")}`,
  );
} catch (e) {
  console.log(`  ❌ foodEngine: ${e.message}`);
}

try {
  const { generatePlan } = require(`${base}/engine/weddingPlannerEngine`);
  const plan = generatePlan({
    budget: 1000000,
    religion: "hindu",
    guests: 400,
    location: "Rajasthan",
    theme: "royal",
  });
  console.log(
    `  ✅ weddingPlannerEngine: ${plan.events.length} events, primaryVenue=${plan.primaryVenue?.name}, tier=${plan.budget.tier}`,
  );
} catch (e) {
  console.log(`  ❌ weddingPlannerEngine: ${e.message}`);
}

console.log(
  `\n=== RESULT: ${dataOK}/${dataFiles.length} data files, ${engOK}/${engineFiles.length} engines loaded ===\n`,
);
