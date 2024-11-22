import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../services/database";
import { Quote } from "../types/quotes";

// GET: All Quotes
export const getAllQuotes = async (_req: Request, res: Response) => {
    try {
        const collection = getCollection("quotes");
        const quotes = await collection.find({}).toArray();
        res.status(200).json(quotes);
    } catch (error: any) {
        res.status(500).json({ error: `Error fetching quotes: ${error.message}` });
    }
};

// GET: Quote by ID
export const getQuoteById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
    }

    try {
        const collection = getCollection("quotes");
        const quote = await collection.findOne({ _id: new ObjectId(id) });

        if (!quote) {
            res.status(404).json({ error: `Quote with id ${id} not found` });
            return;
        }

        res.status(200).json(quote);
    } catch (error: any) {
        res.status(500).json({ error: `Error fetching quote: ${error.message}` });
    }
};

// POST: Create a New Quote or Many Quotes
export const createQuote = async (req: Request, res: Response) => {
    try {
        const quotes: Quote[] | Quote = req.body;
        const collection = getCollection("quotes");

        let result;

        if (Array.isArray(quotes)) {
            result = await collection.insertMany(quotes);
        } else {
            result = await collection.insertOne(quotes);
        }

        if ("insertedCount" in result) {
            const insertedIds = Object.values(result.insertedIds);
            res.status(201).json({ message: `${result.insertedCount} quotes created`, insertedIds });
        } else if ("insertedId" in result) {
            res.status(201).json({ message: "Quote created", id: result.insertedId });
        } else {
            res.status(500).json({ error: "Failed to create quote(s)" });
        }
    } catch (error: any) {
        res.status(400).json({ error: `Error creating quote(s): ${error.message}` });
    }
};

// PUT: Update an Existing Quote
export const updateQuoteById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
    }

    try {
        const updatedQuote: Partial<Quote> = req.body;
        const collection = getCollection("quotes");

        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedQuote });

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: `Quote with id ${id} updated successfully` });
        } else {
            res.status(404).json({ error: `Quote with id ${id} not found or no changes made` });
        }
    } catch (error: any) {
        res.status(400).json({ error: `Error updating quote: ${error.message}` });
    }
};

// DELETE: Remove a Quote
export const deleteQuoteById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
    }

    try {
        const collection = getCollection("quotes");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.status(202).json({ message: `Quote with id ${id} deleted successfully` });
        } else {
            res.status(404).json({ error: `Quote with id ${id} not found` });
        }
    } catch (error: any) {
        res.status(400).json({ error: `Error deleting quote: ${error.message}` });
    }
};
