import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { router as roomRouter } from "./room-router.js";
import { roomRepository } from "./room.js";
import { playerRepository } from "./player.js";
import { playersOut } from "./utils.js";

let app = express();
const server = http.createServer(app);
const io = new Server(server, {
    // TODO: Lock this down later.
    cors: {
        origin: '*'
    }
});
io.use((socket, next) => {
    const playerId = socket.handshake.auth.playerId;
    if (!playerId) {
        return next(new Error('Something went wrong....'))
    }
    socket.playerId = playerId
    next();
});

app.use(express.json());
// TODO: Lock this down later.
app.use(cors({
    origin: '*'
}));
app.use('/room', roomRouter);

app.get('/', (req, res) => {
    res.send({
        name: process.env.npm_package_name,
        version: process.env.npm_package_version,
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

// All web socket server logic.
// TODO: Find a way to let players refresh without being disconnected and kicked from their lobby.
io.on("connect", async (socket) => {
    console.log(socket.playerId);
    let player = await playerRepository.fetch(socket.playerId)
    if (!player.roomId) {
        socket.emit("invalid-user", "Please create or join a valid game.")
    }
    else {
        let room = await roomRepository.fetch(player.roomId)
        socket.join(room.roomName);
        let lobbyData = await playerRepository.search().where('roomId').equals(room.entityId).sortBy('dateJoined', 'ASC').all();

        io.to(room.roomName).emit("send-data", playersOut(lobbyData));
    }
    socket.on("disconnect", async (reason) => {
        let player = await playerRepository.fetch(socket.playerId)
        let room = await roomRepository.fetch(player.roomId);
        if (!player.roomId) {
            // Do nothing, because the player has already been deleted on lobby cascade delete.
            // This else if is important to not pass null values to DB query below. (It crashes the app)
        }
        // If player is host, shut down the lobby.
        else if (player.isHost) {
            let players = await playerRepository.search().where('roomId').equals(room.entityId).all();
            io.to(room.roomName).emit("lobby-close", "The host has left, please find/host a new game.");
            for (let p in players) {
                await playerRepository.remove(players[p].entityId);
            }
            await roomRepository.remove(room.entityId);
            socket.leave(room.roomName);
        }
        // Else only remove the player exiting.
        else {
            await playerRepository.remove(socket.playerId);
            socket.leave(room.roomName);

            let lobbyData = await playerRepository.search().where('roomId').equals(room.entityId).sortBy('dateJoined', 'ASC').all();
            io.to(room.roomName).emit("send-data", playersOut(lobbyData));
        }
    });
});
