import { Router } from "express";
import { roomRepository } from "./room.js";
import { playerRepository } from "./player.js";
import { makeRoomCode } from "./utils.js"

export const router = Router()

router.put('/', async (req, res) => {
    let room = roomRepository.createEntity();
    let player = playerRepository.createEntity();

    let roomCode = makeRoomCode();
    while (await roomRepository.search().where('roomName').equals(roomCode).first()) {
        roomCode = makeRoomCode();
    }

    room.roomName = roomCode ?? null;
    room.ruleset = req.body.ruleset ?? null;
    const roomId = await roomRepository.save(room);

    player.roomId = roomId ?? null;
    player.userName = req.body.userName ?? null;
    player.isHost = req.body.isHost ?? false;
    player.dateJoined = new Date() ?? null;
    const playerId = await playerRepository.save(player)

    res.send({roomId, playerId});

});

router.get('/:id', async (req, res) => {
    let room = await roomRepository.fetch(req.params.id);

    res.send(room);
});

router.get('/player/:id', async (req, res) => {
    let player = await playerRepository.fetch(req.params.id);

    res.send(player);
});