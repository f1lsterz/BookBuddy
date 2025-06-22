import express from "express";
import libraryRouter from "./libraryRoute.js";
import userRouter from "./userRoute.js";
import bookRouter from "./bookRoute.js";
import clubRouter from "./clubRoute.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/library", libraryRouter);
router.use("/books", bookRouter);
router.use("/clubs", clubRouter);

export default router;
