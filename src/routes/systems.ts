import { Router } from "express";
import { createSystem, deleteSystemById, getAllSystems, getSystemById, getSystemByName, updateSystembyId } from "../controllers/systems";

export const router = Router();

router.get("/", getAllSystems);
router.get("/:name", getSystemByName);
// router.get("/:id", getSystemById);
router.put("/:id", updateSystembyId);
router.post("/", createSystem);
router.delete("/:id", deleteSystemById)
