/**
 * scripts/seedVenues.js
 * Run this script to populate the database with sample venues.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Venue = require("../models/Venue");

const venues = [
  {
    name: "The Leela Palace",
    city: "Udaipur",
    type: "resort",
    priceRange: "luxury",
    capacity: 400,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Lake Pichola, Udaipur",
    amenities: ["Spa", "Pool", "Grand Ballroom", "Lake View"],
  },
  {
    name: "Taj Exotica Resort",
    city: "Goa",
    type: "beach",
    priceRange: "luxury",
    capacity: 300,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    address: "Benaulim Beach, South Goa",
    amenities: ["Private Beach", "Golf", "Ballroom", "Ocean View"],
  },
  {
    name: "Rambagh Palace",
    city: "Jaipur",
    type: "hotel",
    priceRange: "luxury",
    capacity: 600,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1585551896142-a1bc57303f83",
    address: "Bhawani Singh Road, Jaipur",
    amenities: ["Historic Palace", "Polo Grounds", "Gardens"],
  },
  {
    name: "Cidade de Goa",
    city: "Goa",
    type: "resort",
    priceRange: "premium",
    capacity: 250,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    address: "Vainguinim Beach, Dona Paula",
    amenities: ["Pool", "Water Sports", "Garden Wedding Space"],
  },
  {
    name: "Radisson Blu Palace",
    city: "Udaipur",
    type: "resort",
    priceRange: "premium",
    capacity: 450,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    address: "Near Fateh Sagar Lake, Udaipur",
    amenities: ["Rooftop Restaurant", "Spa", "Banquet Hall"],
  },
  {
    name: "Sahara Star",
    city: "Mumbai",
    type: "hotel",
    priceRange: "luxury",
    capacity: 800,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    address: "Opp Domestic Airport, Mumbai",
    amenities: ["Tropical Lagoon", "Grand Ballroom", "Fine Dining"],
  },
  {
    name: "Whispering Palms Beach Resort",
    city: "Goa",
    type: "beach",
    priceRange: "mid-range",
    capacity: 150,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
    address: "Candolim Beach, North Goa",
    amenities: ["Beach Access", "Poolside Deck"],
  },
  {
    name: "Garden Retreat",
    city: "Jaipur",
    type: "garden",
    priceRange: "budget",
    capacity: 200,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e",
    address: "C-Scheme, Jaipur",
    amenities: ["Lush Lawns", "Open Air Setup"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Venue.deleteMany({});
    console.log("Cleared existing venues.");

    await Venue.insertMany(venues);
    console.log(`Successfully seeded ${venues.length} venues.`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding venues:", err.message);
    process.exit(1);
  }
};

seedDB();
