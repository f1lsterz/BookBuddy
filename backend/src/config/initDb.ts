import sequelize from "./db.js";
import defineAssociations from "../models/associations.js";

export default async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();

    console.log("Connected to SQLite database successfully.");

    defineAssociations();
    await sequelize.sync();
    console.log("All models synchronized.");
  } catch (error) {
    console.error("Error initializing the database:", error);
    throw error;
  }
}
