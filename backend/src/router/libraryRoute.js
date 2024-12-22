import { Router } from "express";
import libraryController from "../controllers/library_controller.js";

const router = Router();

router.get("/:userId", libraryController.getLibrary);
router.post("/custom", libraryController.createCustomList);
router.delete("/custom/:userId/:libraryId", libraryController.deleteCustomList);
router.get("/lists/:userId/:libraryId", libraryController.getBooksInList);
router.post("/lists/:bookId/:libraryId", libraryController.addBookToLibrary);
router.delete(
  "/lists/:bookId/:libraryId",
  libraryController.removeBookFromLibrary
);
router.get(
  "/lists/check/:bookId/:libraryId",
  libraryController.checkBookInLibrary
);

router.put(
  "/lists/visibility/:userId/:libraryId",
  libraryController.updateListVisibility
);

export default router;
