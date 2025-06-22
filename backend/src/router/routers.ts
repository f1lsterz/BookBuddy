import express from "express";
import libraryRouter from "./libraryRoute.js";
import userRouter from "./userRoute.js";
import bookRouter from "./bookRoute.js";
import clubRouter from "./clubRoute.js";
import authRouter from "./authRoute.js";
import commentRouter from "./commentRoute.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/libraries", libraryRouter);
router.use("/books", bookRouter);
router.use("/clubs", clubRouter);
router.use("/comments", commentRouter);

export default router;
