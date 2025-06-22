import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/db.js";
import router from "./router/routers.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import bookService from "./service/bookService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");

    const existingBooks = await bookService.countBooks();
    if (existingBooks === 0) {
      console.log(
        "No books found in the database. Fetching and storing books..."
      );
      await bookService.fetchAndStoreBooks();
    } else {
      console.log(
        `Books already exist in the database (${existingBooks} records). Skipping fetch.`
      );
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
