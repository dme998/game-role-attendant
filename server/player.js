import { Client, Entity, Schema } from "redis-om";

class Player extends Entity {}

const playerSchema = new Schema(Player, {
    userName: {type: 'string'},
    isHost: {type: 'boolean'},
    roomId: {type: 'string'},
    dateJoined: {type: 'date'},
});

const client = await new Client().open();

export const playerRepository = client.fetchRepository(playerSchema);

await playerRepository.createIndex();