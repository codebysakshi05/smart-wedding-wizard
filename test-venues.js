async function test() {
  try {
    const res = await fetch(
      "http://localhost:5000/api/venues/recommend?state=Karnataka&budget=high&guests=500",
    );
    console.log("Status:", res.status);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
