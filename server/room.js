import { Client, Entity, Schema } from "redis-om";

class Room extends Entity {}

const roomSchema = new Schema(Room, {
    roomName: {type: 'string'},
    ruleset: {type: 'string'},
});

const client = await new Client().open();

export const roomRepository = client.fetchRepository(roomSchema);

await roomRepository.createIndex();