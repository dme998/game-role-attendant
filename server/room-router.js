import { Router } from "express";
import { roomRepository } from "./room.js";
import { playerRepository } from "./player.js";
import { makeRoomCode, normalizeUsername, validateRoomCode, getTTLDate } from "./utils.js";
import { SecretHitler } from "./rulesets.js";

export const router = Router()
const MAX_TTL = 21600; // expiration time to live to be used by generated objects in seconds.
const RULESETS = {"Secret Hitler": SecretHitler}

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
			return res.send({errorMessage: "approaching infinite loop"});
		}
		else {
			roomCode = makeRoomCode();
		}
		counter++;
	}
	room.roomName = roomCode ?? null;
	
	/* check user input and match to ruleset
	** if no user input exists, default to first index in ruleset */
	if (RULESETS[req.body.ruleset]) {
		room.ruleset = req.body.ruleset ?? null;
	}
	else {
		room.ruleset = Object.keys(RULESETS)[0] ?? null;
	}

	// Make sure player count is valid.
	const ruleset = new RULESETS[room.ruleset];
	const playerCount = parseInt(req.body.playerCount);
	if (!playerCount) {
		res.status(400);
		return res.send({errorMessage: "Bad request."});
	}
	if (playerCount < ruleset.playerCounts.minCount || playerCount > ruleset.playerCounts.maxCount) {
		res.status(422);
		return res.send({errorMessage: "Player count invalid."});
	}

	room.playerCount = playerCount ?? null;
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

	return res.send({roomCode, userName, playerId});

});

/* join endpoint */
router.put('/join', async (req, res) => {
	const roomCode = validateRoomCode(req.body.roomCode)
	const room = await roomRepository.search().where('roomName').equals(roomCode).first();
	if (!room) {
		res.status(404);
		return res.send({errorMessage: "Room not found!"})
	}

	const userName = normalizeUsername(req.body.userName);
	const playerQuery = await playerRepository.search().where('roomId').equals(room.entityId).all();
	let existingPlayers = []
	for (let p in playerQuery) {
		existingPlayers.push(playerQuery[p].userName.toLowerCase());
	}
	// Check if room is full
	if (existingPlayers.length === room.playerCount) {
		res.status(409);
		return res.send({errorMessage: "Room is full!"});
	}
	// Check if username is already taken
	if (existingPlayers.includes(userName.toLowerCase())) {
		res.status(409);
		return res.send({errorMessage: "Username is already taken!"})
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

router.get('/rulesets', async (req, res) => {
	return res.send(Object.keys(RULESETS));
});

// TODO: Finish this endpoint, hook up web sockets to disperse role information.
router.put('/start', async (req, res) => {
	let player = await playerRepository.fetch(req.body.playerId);
	let players = await playerRepository.search().where('roomId').equals(player.roomId).all();
	let data = await new SecretHitler(players).setRolesForPlayers();
	console.log(data)
	res.status(200);
	return res.send('')
});

router.get('/player/:id', async (req, res) => {
    let player = await playerRepository.fetch(req.params.id);

    return res.send(player);
});