// External Dependencies
import { MongoClient, Db } from "mongodb";
import { config } from "dotenv";

// Global Database Object
let db: Db | null = null;

// Initialize Database Connection
export const connectToDatabase = async (): Promise<void> => {
    // Load environment variables
    config();

    // Retrieve and validate environment variables
    const connectionString = process.env.DB_CONN_STRING;
    const dbName = process.env.DB_NAME;

    if (!connectionString || !dbName) {
        throw new Error("Missing required environment variables: DB_CONN_STRING or DB_NAME");
    }

    // Create a new MongoDB client
    const client = new MongoClient(connectionString);

    try {
        // Connect to the database
        await client.connect();

        // Assign the connected database instance to the global variable
        db = client.db(dbName);

        console.log(`Successfully connected to database: ${db.databaseName}`);
    } catch (error) {
        console.error("Failed to connect to the database", error);
        throw error;
    }
};

// Utility Function to Retrieve Collections
export const getCollection = (collectionName: string) => {
    if (!db) {
        throw new Error("Database not initialized. Call connectToDatabase() first.");
    }

    return db.collection(collectionName);
};
