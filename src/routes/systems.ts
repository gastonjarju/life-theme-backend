import { Router } from "express";
import { createSystem, getAllSystems, getSystemById, getSystemByName } from "../controllers/systems";

export const router = Router();

router.get("/", getAllSystems);
router.get("/:name", getSystemByName)
router.post("/", createSystem);