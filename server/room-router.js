import { Router } from "express";
import { roomRepository } from "./room.js";
import { playerRepository } from "./player.js";
import { makeRoomCode, normalizeUsername, getTTLDate } from "./utils.js";

export const router = Router()
const MAX_TTL = 21600; // expiration time to live to be used by generated objects in seconds.
const RULESETS = ["Secret Hitler", "Undefined Ruleset"];

router.put('/', async (req, res) => {  // room
    let room = roomRepository.createEntity();
    let player = playerRepository.createEntity();

    let roomCode = makeRoomCode();
	
	/* attempt to create a non-existing room by chance
	** if it fails after counter hits max, then throw response alert error */
	let counter = 0;
	while (await roomRepository.search().where('roomName').equals(roomCode).first()) {
		if (counter > 100) {
			res.status(508);
			return res.send("approaching infinite loop");
		}
		else {
			roomCode = makeRoomCode();
		}
		counter++;
	}
	room.roomName = roomCode ?? null;
	
	/* check user input and match to ruleset
	** if no user input exists, default to first index in ruleset */
	for(let i = 0; i < RULESETS.length; i++) {
		if (req.body.ruleset === RULESETS[i]) {
			room.ruleset = req.body.ruleset ?? null;
		}
		else {
			room.ruleset = RULESETS[0] ?? null;
		}
	}
	
	room.dateCreated = new Date() ?? null;
	room.dateEnd = getTTLDate(room.dateCreated, MAX_TTL) ?? null;
	const roomId = await roomRepository.save(room);  //async
	await roomRepository.expire(roomId, MAX_TTL)

    player.roomId = roomId ?? null;
    player.userName = normalizeUsername(req.body.userName) ?? null;
    player.isHost = true;
    player.dateJoined = new Date() ?? null;
    const playerId = await playerRepository.save(player)
	await playerRepository.expire(playerId, MAX_TTL)

    res.send({roomId, playerId});  //debug
	
	/* potential:
		const players = await playerRepository.search().where('roomId').equals(roomId).all()
    	res.send({roomCode, players}); 
	*/

});

router.get('/:id', async (req, res) => {
    let room = await roomRepository.fetch(req.params.id);

    res.send(room);
});

router.get('/player/:id', async (req, res) => {
    let player = await playerRepository.fetch(req.params.id);

    res.send(player);
});