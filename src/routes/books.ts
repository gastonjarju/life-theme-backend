import { Router } from "express";

import { createBook, getAllBooks, updateBookById } from "../controllers/books";

export const router = Router();

router.get("/", getAllBooks);
router.post("/", createBook);
router.put("/:id", updateBookById);
