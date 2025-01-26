import { Request, Response } from "express";
import { Book } from "../types/books";
import { ObjectId } from "mongodb";
import { getBookCollection } from "../collection/book";


// GET: Get all books with optional query parameters
export const getAllBooks = async (req: Request, res: Response) => {
	try {
		const collection = getBookCollection();

		// Build the filter object based on the query params
		const filter: Record<string, any> = {};

		// Add filters if query parameters are present
		if (req.query.author) {
			filter.author = new RegExp(req.query.author as string, "i"); // Case-insensitive match for author
		}

		if (req.query.title) {
			filter.title = new RegExp(req.query.title as string, "i"); // Case-insensitive match for title
		}

		if (req.query.system) {
			filter.system = req.query.system; // Exact match for system
		}

		if (req.query.inInventory) {
			filter["status.inInventory"] = req.query.inInventory === "true"; // Convert string 'true' to boolean
		}

		if (req.query.isRead) {
			filter["status.isRead"] = req.query.isRead === "true"; // Convert string 'true' to boolean
		}

		// Fetch the books from the MongoDB collection based on the filter
		const books = await collection.find(filter).toArray();

		// Type assertion: cast books as Book[] to satisfy the TypeScript type
		res.status(200).json(books);
	} catch (error: any) {
		res.status(500).json({ error: `Error in fetching books: ${error.message}` });
	}
};
// GET: Get one book by Id

// POST: Create a new book document or many book documents
export const createBook = async (req: Request, res: Response) => {
	const book: Book[] | Book = req.body;
	const collection = getBookCollection();
	let result;
	try {
		if (Array.isArray(book)) {
			result = await collection.insertMany(book);
		} else {
			result = await collection.insertOne(book);
		}
		if ("insertedCount" in result) {
			const insertedIds = Object.values(result.insertedIds);
			res.status(201).json({ message: `${result.insertedCount} books created`, insertedIds });
		} else if ("insertedId" in result) {
			res.status(201).json({ message: "Book Created", id: result.insertedId });
		} else {
			res.status(500).json({ error: "Failed to create book(s)" });
		}
	} catch (error: any) {
		res.status(400).json({ error: `Error creating book(s) ${error.message}` });
	}
};

// PUT: Update one or many books
export const updateBookById = async (req: Request, res: Response) => {
	const updateBookData = req.body;
	const idOrIds = req.params.id;
	const collection = getBookCollection();
	if (!updateBookData || Object.values(idOrIds).length === 0) {
		res.status(400).json({ error: "No data provided to update" });
		return;
	}
	try {
		let result;
		if (Array.isArray(idOrIds)) {
			if (!idOrIds.every((id) => ObjectId.isValid(id))) {
				res.status(400).json({ error: "One or more IDs are invalid" });
				return;
			}
			result = await collection.updateMany(
				{ _id: { $in: idOrIds.map((id) => new ObjectId(id)) } },
				{ $set: updateBookData },
			);
			res.status(200).json({
				message: `${result.modifiedCount} books updated successfully`,
			});
		} else {
			// Validate single ID
			if (!ObjectId.isValid(idOrIds)) {
				res.status(400).json({ error: `Book ID ${idOrIds} is not valid` });
				return;
			}
			// Update one book
			result = await collection.updateOne({ _id: new ObjectId(idOrIds) }, { $set: updateBookData });
			if (result.matchedCount === 0) {
				res.status(404).json({ error: `Book with ID ${idOrIds} not found` });
			} else if (result.modifiedCount > 0) {
				res.status(200).json({ message: `Book with ID ${idOrIds} successfully updated` });
			} else {
				res.status(200).json({ message: `No changes made to the book with ID ${idOrIds}` });
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: `Error updating books ${error.message}` });
	}
};

//DELETE: Delete one book by ID
export const deleteBookById = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!ObjectId.isValid(id)) {
		res.status(400).json({ error: "Invalid ID format" });
		return;
	}
	try {
		const collection = getBookCollection();
		const result = await collection.deleteOne({ _id: new ObjectId(id) });

		if (result.deletedCount > 0) {
			res.status(202).json({ message: `Book with id ${id} deleted successfully` });
		} else {
			res.status(404).json({ error: `Book with id ${id} not found` });
		}
	} catch (error: any) {
		res.status(400).json({ error: `Error deleteing quote: ${error.message}` });
	}
};
