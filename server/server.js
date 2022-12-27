import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { router as roomRouter } from "./room-router.js";
import { roomRepository } from "./room.js";
import { playerRepository } from "./player.js";

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
io.on("connect", async (socket) => {
    console.log(socket.playerId);
    let player = await playerRepository.fetch(socket.playerId)
    let room = await roomRepository.fetch(player.roomId)
    socket.join(room.roomName);
    let lobbyData = await playerRepository.search().where('roomId').equals(room.entityId).sortBy('dateJoined', 'ASC').all();

    io.to(room.roomName).emit("send-data", lobbyData);

    socket.on("disconnect", async (reason) => {
        await playerRepository.remove(socket.playerId);
        socket.leave(room.roomName);
        console.log(reason);

        lobbyData = await playerRepository.search().where('roomId').equals(room.entityId).sortBy('dateJoined', 'ASC').all();
        io.to(room.roomName).emit("send-data", lobbyData)
    });
});
