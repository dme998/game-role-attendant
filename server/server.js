import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { router as roomRouter } from "./room-router.js";

let app = express();
const server = http.createServer(app);
export const io = new Server(server);

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