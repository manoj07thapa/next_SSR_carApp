import { openDB } from '../openDB';

export interface Model {
	model: string;
	count: number;
}

export async function getModels(make: string) {
	const db = await openDB();
	// const makes = await db.all<Make[]>(`SELECT make, count(*) as count FROM car GROUP BY name`);
	const models = await db.all<Model[]>(
		`SELECT model, count(*) as count FROM Car WHERE make = ? GROUP BY model`,
		make
	);
	return models;
}
