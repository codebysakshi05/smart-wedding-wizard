const venueController = require("./backend/controllers/venue.controller");

async function runTest() {
  const req = {
    query: {
      state: "Karnataka",
      budget: "high",
      guests: "500",
    },
  };

  const res = {
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      console.log("StatusCode:", this.statusCode);
      console.log("Data:", JSON.stringify(data, null, 2));
      return this;
    },
  };

  await venueController.recommendVenues(req, res);
}

runTest();
