import { Response, Request } from "express";
import { getCollection } from "../services/database";
import { System } from "../types/systems";
import { ObjectId } from "mongodb";

// GET: Get all systems
export const getAllSystems = async (_req: Request, res: Response) => {
	try {
		const collection = getCollection("systems");
		const systems = await collection.find({}).toArray();
		res.status(200).json(systems);
	} catch (error: any) {
		res.status(500).json({ error: `Error fetching systems ${error.message}` });
	}
};

// POST: Create one or Many systems
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
			res.status(201).json({ message: `${result.insertedCount} systems created`, insertedIds });
		} else if ("insertedId" in result) {
			res.status(201).json({ message: "System Created", id: result.insertedId });
		} else {
			res.status(500).json({ error: "Failed to create system(s)" });
		}
	} catch (error: any) {
		res.status(400).json({ error: `Error creating system(s) ${error.message}` });
	}
};

// GET: Get system by name
export const getSystemByName = async (req: Request, res: Response) => {
	const id: string = req.params.name;

	if (!id) {
		res.status(400).json({ error: "Invalid System name format" });
		return;
	}
	try {
		const collection = getCollection("systems");
		const system = await collection.findOne({ name: { $regex: `^${id}$`, $options: "i" } });

		if (!system) {
			res.status(404).json({ error: `System with name "${id}" not found.` });
			return;
		}
		res.status(200).json(system);
	} catch (error: any) {
		res.status(500).json({ error: `Error fetching system: ${error.message}` });
		return;
	}
};

// GET: Get system by Id
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

// PUT: Update an existing system
export const updateSystembyId = async (req: Request, res: Response) => {
	const idOrIds = req.params.id;
	const collection = getCollection("systems");
	const updateData = req.body;

	// Validate input
	if (!updateData || Object.keys(updateData).length === 0) {
		res.status(400).json({ error: "No data provided to update" });
		return;
	}
	try {
		let result;
		if (Array.isArray(idOrIds)) {
			// Validate all IDS in the array
			if (!idOrIds.every((id) => ObjectId.isValid(id))) {
				res.status(400).json({ error: "One or more IDs are invalid" });
				return;
			}
			// Update many systems
			result = await collection.updateMany(
				{ _id: { $in: idOrIds.map((id) => new ObjectId(id)) } },
				{ $set: updateData },
			);
			res.status(200).json({
				message: `${result.modifiedCount} systems updated successfully`,
			});
		} else {
			// Validate single ID
			if (!ObjectId.isValid(idOrIds)) {
				res.status(400).json({ error: `System ID ${idOrIds} is not valid` });
				return;
			}
			// Update one system
			result = await collection.updateOne({ _id: new ObjectId(idOrIds) }, { $set: updateData });
			if (result.matchedCount === 0) {
				res.status(404).json({ error: `System with ID ${idOrIds} not found` });
			} else if (result.modifiedCount > 0) {
				res.status(200).json({ message: `System with ID ${idOrIds} successfully updated` });
			} else {
				res.status(200).json({ message: `No changes made to teh system with ID ${idOrIds}` });
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: `Error updating system(s): ${error.message}` });
	}
};

// Delete a system document
export const deleteSystemById = async (req: Request, res: Response) => {
	const id = req.params.id;
	const collection = getCollection("systems");
	if (!ObjectId.isValid(id)) {
		res.status(400).json({ error: `System ID ${id} is not valid` });
		return;
	}
	try {
		const result = await collection.deleteOne({ _id: new ObjectId(id) });
		if (result.deletedCount === 1) {
			res.status(200).json({ message: `System ${id} successfully deleted` });
		} else {
			res.status(404).json({ error: `System ${id} not found` });
		}
	} catch (error: any) {
		res.status(500).json({ error: `Error deleting system: ${error.message}` });
	}
};
