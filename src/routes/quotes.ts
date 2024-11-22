import { Router } from "express";
import { getAllQuotes, getQuoteById, createQuote, updateQuoteById, deleteQuoteById } from "../controllers/quotes";

export const router = Router();

// Routes
router.get("/", getAllQuotes);
router.get("/:id", getQuoteById);
router.post("/", createQuote);
router.put("/:id", updateQuoteById);
router.delete("/:id", deleteQuoteById);
