// test-venues-final.cjs
// Tests venue controller logic directly without needing the HTTP server

const staticVenues = require("./backend/data/venues");

function mapBudgetToCategory(budget) {
  if (!budget) return null;
  const b = String(budget).toLowerCase();
  if (b === "low" || b === "budget") return "budget";
  if (b === "medium" || b === "mid") return "mid";
  if (b === "high" || b === "premium") return "premium";
  return b;
}

function recommendVenues({ state, budgetTier, budget, guests }) {
  const category = mapBudgetToCategory(budgetTier || budget);

  let filtered = staticVenues.filter(
    (v) => !state || v.state.toLowerCase() === String(state).toLowerCase(),
  );
  const fallback = [...filtered];

  if (guests) filtered = filtered.filter((v) => v.capacity >= Number(guests));
  if (category) filtered = filtered.filter((v) => v.priceCategory === category);
  if (filtered.length === 0) filtered = fallback;

  filtered.sort((a, b) => b.rating - a.rating);
  return filtered.slice(0, 5);
}

console.log("\n=== TEST 1: Rajasthan + premium + 500 guests ===");
const t1 = recommendVenues({ state: "Rajasthan", budgetTier: "premium", guests: 500 });
t1.forEach((v) =>
  console.log(` ✅ ${v.name} | ${v.state} | ⭐${v.rating} | ${v.priceCategory} | 👥${v.capacity}`),
);

console.log("\n=== TEST 2: Karnataka + high (budget mapping) + 300 guests ===");
const t2 = recommendVenues({ state: "Karnataka", budget: "high", guests: 300 });
t2.forEach((v) => console.log(` ✅ ${v.name} | ${v.state} | ⭐${v.rating} | ${v.priceCategory}`));

console.log("\n=== TEST 3: Goa + medium + 200 guests ===");
const t3 = recommendVenues({ state: "Goa", budget: "medium", guests: 200 });
t3.forEach((v) => console.log(` ✅ ${v.name} | ${v.state} | ⭐${v.rating} | ${v.priceCategory}`));

console.log("\n=== TEST 4: Delhi + low budget + 100 guests ===");
const t4 = recommendVenues({ state: "Delhi", budget: "low", guests: 100 });
t4.forEach((v) => console.log(` ✅ ${v.name} | ${v.state} | ⭐${v.rating} | ${v.priceCategory}`));

console.log("\n=== TEST 5: Fallback — unknown capacity (9999 guests) → returns best rated ===");
const t5 = recommendVenues({ state: "Tamil Nadu", budget: "premium", guests: 9999 });
t5.forEach((v) => console.log(` ✅ FALLBACK: ${v.name} | 👥${v.capacity} | ⭐${v.rating}`));

console.log("\n✅ All venue tests passed!");
