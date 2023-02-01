import { Client, Entity, Schema } from "redis-om";

class Player extends Entity {}

const playerSchema = new Schema(Player, {
  userName: { type: "string" },
  isHost: { type: "boolean" },
  roomId: { type: "string" },
  dateJoined: { type: "date", sortable: true },
});

const client = await new Client();
await client.open(process.env.REDIS_URL);

export const playerRepository = client.fetchRepository(playerSchema);

await playerRepository.createIndex();
