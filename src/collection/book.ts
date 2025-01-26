import { getCollection } from "../services/mongo_db";
import { Collection } from "mongodb";

let bookCollection: Collection | null = null;

export const getBookCollection = (): Collection => {
	if (!bookCollection) {
		bookCollection = getCollection("books");
	}
	return bookCollection;
};
