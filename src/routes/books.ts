import { Router } from "express";

import { createBook, deleteBookById, getAllBooks, updateBookById } from "../controllers/books";

export const router = Router();

router.get("/", getAllBooks);
router.post("/", createBook);
router.put("/:id", updateBookById);
router.delete("/:id", deleteBookById);

export default router;
