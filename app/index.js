const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to GigsBerg App Test🚀");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Healthy!");
});

// API endpoints
app.get("/api/gigs", (req, res) => {
  // Placeholder for gig listing functionality
  const gigs = [
    { id: 1, title: "Web Developer", description: "Build a responsive website", rate: "$50/hr" },
    { id: 2, title: "Graphic Designer", description: "Create logo and branding", rate: "$45/hr" },
    { id: 3, title: "Content Writer", description: "Write blog articles", rate: "$35/hr" }
  ];
  res.json(gigs);
});

// Create a new gig (POST endpoint example)
app.post("/api/gigs", (req, res) => {
  // In a real app, you would validate and save to a database
  console.log("Received new gig:", req.body);
  res.status(201).json({
    message: "Gig created successfully",
    gig: req.body
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
app.listen(port, () => {
  console.log(`GigsBerg App running on port ${port}`);
});
