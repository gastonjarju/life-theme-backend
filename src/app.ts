import express, { Application } from "express";
import { connectToDatabase } from "./services/database";
import { router as quotesRouter } from "./routes/quotes";
import { router as systemsRouter } from "./routes/systems";

const app: Application = express();
const PORT = process.env.PORT || 8080; // Use environment variable for flexibility, fallback to 8080

// Initialize database and start server
const startServer = async () => {
	try {
		await connectToDatabase();
		console.log("Connected to the database successfully.");

		// Middleware and routes
		app.use(express.json()); // Global middleware for parsing JSON
		app.use("/quotes", quotesRouter);
		app.use("/systems", systemsRouter);

		// Start the server
		app.listen(PORT, () => {
			console.log(`🚀 Server is running at http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("❌ Database connection failed:", error.message);
		process.exit(1); // Exit with failure code
	}
};

startServer();
