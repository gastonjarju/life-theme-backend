import { Response, Request } from "express";
import { getCollection } from "../services/database";
import { System } from "../types/systems";
import { ObjectId } from "mongodb";

// Get All Systems
export const getAllSystems = async (_req: Request, res: Response) => {
	try {
		const collection = getCollection("systems");
		const systems = await collection.find({}).toArray();
		res.status(200).json(systems);
	} catch (error: any) {
		res.status(500).json({ error: `Error fetching systems ${error.message}` });
	}
};

// Create one or Many Systems
export const createSystem = async (req: Request, res: Response) => {
	try {
		const systems: System[] | System = req.body;
		const collection = getCollection("systems");
		let result;

		if (Array.isArray(systems)) {
			result = await collection.insertMany(systems);
		} else {
			result = await collection.insertOne(systems);
		}

		if ("insertedCount" in result) {
			const insertedIds = Object.values(result.insertedIds);
			res.status(201).json({ message: `${result.insertedCount} quotes created`, insertedIds });
		} else if ("insertedId" in result) {
			res.status(201).json({ message: "Quote Created", id: result.insertedId });
		} else {
			res.status(500).json({ error: "Failed to create quote(s)" });
		}
	} catch (error: any) {
		res.status(400).json({ error: `Error creating system(s) ${error.message}` });
	}
};

// Get system by Name
export const getSystemByName = async (req: Request, res: Response) => {
	const systemName: string = req.params.name;

	if (!systemName) {
		res.status(400).json({ error: "Invalid System name format" });
		return;
	}
	try {
		const collection = getCollection("systems");
		const system = await collection.findOne({ name: { $regex: `^${systemName}$`, $options: "i" } });

		if (!system) {
			res.status(404).json({ error: `System with name "${systemName}" not found.` });
			return;
		}
		res.status(200).json(system);
	} catch (error: any) {
		res.status(500).json({ error: `Error fetching system: ${error.message}` });
		return;
	}
};

// Get system by ID
export const getSystemById = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!ObjectId.isValid(id)) {
		res.status(400).json({ error: "Invalid ID format" });
		return;
	}
	try {
		const collection = getCollection("systems");
		const system = await collection.findOne({ _id: new ObjectId(id) });

		if (!system) {
			res.status(404).json({ error: `System with id ${id} not found` });
			return;
		}
		res.status(200).json(system);
	} catch (error: any) {
		res.status(500).json({ error: `Error fetching system: ${error.message}` });
		return;
	}
};

// Update an existing system

// Delete a system document 