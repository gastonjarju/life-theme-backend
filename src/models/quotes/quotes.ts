// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class Quote {
    constructor(
        public author: string,
        public quote: number,
        public source: string,
        public system: string,
        public date_added: string,
        public id?: ObjectId,
    ) {}
}
