// Idempotent default-admin seed. Run with: mongosh "$MONGODB_URI" db/seed-admin.js
// NOTE: password hash below is bcrypt("admin123", 10); the Spring Boot app seeds the same
// admin on startup (via BCryptPasswordEncoder) so this script is only needed for ad-hoc
// Mongo-only setups that don't go through the API.
const seedEmail = "admin123@gmail.com";
const seedUsername = "admin";
const bcryptHash = "$2a$10$kU57DTJ/OonQ2SLaV.aPB.jV.bqMTgxHinoDqhcb3.W/gnYL2JqKS"; // admin123

const existing = db.admins.findOne({ username: seedUsername });
if (!existing) {
  db.admins.insertOne({ _id: seedEmail, username: seedUsername, password: bcryptHash });
  print("Seeded default admin: " + seedUsername);
} else {
  print("Admin already exists, skipping seed.");
}
