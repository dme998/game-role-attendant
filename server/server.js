import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as dotenv from "dotenv";
import { router as roomRouter } from "./room-router.js";
import { roomRepository } from "./room.js";
import { playerRepository } from "./player.js";
import { playersOut } from "./utils.js";
import { RULESETS } from "./rulesets.js";

dotenv.config();

let app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "deny");
  res.header("Content-Security-Policy", "default-src 'none';");

  next();
});
app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use("/room", roomRouter);

const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
  },
});
io.use((socket, next) => {
  const playerId = socket.handshake.auth.playerId;
  if (!playerId) {
    return next(new Error("Something went wrong...."));
  }
  socket.playerId = playerId;
  next();
});

// All web socket server logic.
io.on("connect", async (socket) => {
  console.log(socket.playerId);
  let player = await playerRepository.fetch(socket.playerId);
  if (!player.roomId) {
    socket.emit("invalid-user", "Please create or join a valid game.");
  } else {
    let room = await roomRepository.fetch(player.roomId);
    socket.join(socket.playerId);
    socket.join(room.roomName);
    let playersInLobby = await playerRepository
      .search()
      .where("roomId")
      .equals(room.entityId)
      .sortBy("dateJoined", "ASC")
      .all();

    io.to(room.roomName).emit("send-data", {
      players: playersOut(playersInLobby),
      roomSize: room.playerCount,
    });
  }

  socket.on("lobby-start", async () => {
    //Player must be host to start game, check server side.
    let player = await playerRepository.fetch(socket.playerId);
    let room = await roomRepository.fetch(player.roomId);
    let playersInLobby = await playerRepository
      .search()
      .where("roomId")
      .equals(room.entityId)
      .sortBy("dateJoined", "ASC")
      .all();
    if (!player.isHost) {
      // Bail and do nothing.
    }
    //Player count must be at max capacity
    else if (room.playerCount === playersInLobby.length) {
      const playerRolesColorsMessages = await new RULESETS[room.ruleset](
        playersInLobby
      ).setRolesForPlayers();
      // Send each player their specific role information.
      for (let p in playerRolesColorsMessages) {
        io.to(playerRolesColorsMessages[p].playerId).emit("role-details", {
          roleType: playerRolesColorsMessages[p].RoleType,
          color: playerRolesColorsMessages[p].color,
          message: playerRolesColorsMessages[p].message,
        });
      }
    } else {
      io.to(socket.playerId).emit(
        "false-start",
        "The lobby does not have enough players to start!"
      );
    }
  });

  socket.on("disconnect", async () => {
    let player = await playerRepository.fetch(socket.playerId);
    let room = await roomRepository.fetch(player.roomId);
    if (!player.roomId) {
      // Do nothing, because the player has already been deleted on lobby cascade delete.
      // This else if is important to not pass null values to DB query below. (It crashes the app)
    }
    // If player is host, shut down the lobby.
    else if (player.isHost) {
      let players = await playerRepository
        .search()
        .where("roomId")
        .equals(room.entityId)
        .all();
      io.to(room.roomName).emit(
        "lobby-close",
        "The host has left, please find/host a new game."
      );
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

      let playersInLobby = await playerRepository
        .search()
        .where("roomId")
        .equals(room.entityId)
        .sortBy("dateJoined", "ASC")
        .all();
      io.to(room.roomName).emit("send-data", {
        players: playersOut(playersInLobby),
        roomSize: room.playerCount,
      });
    }
  });
});
