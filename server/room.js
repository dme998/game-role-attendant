import { Client, Entity, Schema } from "redis-om";

class Room extends Entity {}

const roomSchema = new Schema(Room, {
    roomName: {type: 'string'},
    ruleset: {type: 'string'},
	dateCreated: {type: 'date'},
	dateEnd: {type: 'date'},
});

const client = await new Client()
await client.open(process.env.REDIS_URL)

export const roomRepository = client.fetchRepository(roomSchema);

await roomRepository.createIndex();