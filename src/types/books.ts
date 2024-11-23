export interface Book {
	title: string;
	author: string;
	system: System;
	genre: string;
	description: string;
	status: BookStatus;
}

export interface BookStatus {
	dateStarted?: string;
	dateFinished?: string;
	inInventory: boolean;
	isRead: boolean;
}

export type System = "Wealth" | "Health" | "Career" | "Skills" | "Spirituality" | "Relationships";
