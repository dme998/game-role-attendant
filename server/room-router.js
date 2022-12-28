import { Router } from "express";
import { roomRepository } from "./room.js";
import { playerRepository } from "./player.js";
import { makeRoomCode, normalizeUsername, validateRoomCode, getTTLDate } from "./utils.js";
import { SecretHitler } from "./rulesets.js";

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

	const userName = normalizeUsername(req.body.userName)
    player.roomId = roomId ?? null;
    player.userName = userName ?? null;
    player.isHost = true;
    player.dateJoined = new Date() ?? null;
    const playerId = await playerRepository.save(player)
	await playerRepository.expire(playerId, MAX_TTL)

    // return res.send({roomId, playerId});  //debug

	// const players = await playerRepository.search().where('roomId').equals(roomId).sortBy('dateJoined').all()
	return res.send({roomCode, userName, playerId});

});

/* join endpoint */
router.put('/join', async (req, res) => {
	const roomCode = validateRoomCode(req.body.roomCode)
	const room = await roomRepository.search().where('roomName').equals(roomCode).first();
	if (!room) {
		res.status(404);
		return res.send("Room not found!")
	}
	
	/* Check if duplicate username exists and send error if so */
	const userName = normalizeUsername(req.body.userName);
	const playerQuery = await playerRepository.search().where('roomId').equals(room.entityId).all();
	let existingPlayers = []
	playerQuery.forEach((p) => {
		existingPlayers.push(p.entityFields.userName._value.toLowerCase());
	});
	if (existingPlayers.includes(userName.toLowerCase())) {
		res.status(409);
		return res.send("Username is already taken!")
	}

	let player = playerRepository.createEntity();
	player.roomId = room.entityId ?? null;
	player.userName = userName ?? null;
	player.isHost = false;
	player.dateJoined = new Date() ?? null;
	const playerId = await playerRepository.save(player);
	await playerRepository.expire(playerId, MAX_TTL);

	return res.send({roomCode, userName, playerId})
});

router.put('/start', async (req, res) => {
	let player = await playerRepository.fetch(req.body.playerId);
	let players = await playerRepository.search().where('roomId').equals(player.roomId).all();
	let data = new SecretHitler(players).setRolesForPlayers();
	console.log(data)
    return res.status(200);
});

router.get('/player/:id', async (req, res) => {
    let player = await playerRepository.fetch(req.params.id);

    return res.send(player);
});