<template>
  <q-page class="flex flex-center">
    <div class="column">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-list bordered padding id="player-list">
          <q-item>
            <q-item-section>
              <q-item-label overline>{{
                `ROOM CODE: ${this.$route.params.roomCode}`
              }}</q-item-label>
              <q-item-label></q-item-label>
            </q-item-section>
          </q-item>
          <q-item-label header>{{ `Player Count: ${this.players.length}/${this.roomSize}` }}</q-item-label>

          <q-separator spaced />

          <ul style="list-style: none; padding-left: 0">
            <li v-for="player in players" :key="player.id">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar>
                    <img
                      src="https://cdn.quasar.dev/img/boy-avatar.png"
                      alt="User Avatar"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ player.userName }}</q-item-label>
                </q-item-section>

                <div v-if="player.isHost">
                  <q-item-section side>
                    <q-icon name="star" color="yellow" />
                  </q-item-section>
                </div>
              </q-item>

              <q-separator spaced inset="item" />
            </li>
          </ul>

          <div style="text-align: center; padding-top: 3px">
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
            <q-btn
              @click="onAbort"
              label="Leave"
              type="button"
              color="negative"
            ></q-btn>
          </div>
        </q-list>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { socketIo } from "boot/socket.io";
import { api } from "boot/axios";

export default {
  name: "LobbyPage",

  data() {
    return {
      players: [],
      roomSize: 10,
    };
  },

  mounted() {
    this.fetchRoomData();
  },

  methods: {
    fetchRoomData() {
      const playerId = localStorage.getItem("playerId");
      socketIo.auth = { playerId };
      socketIo.connect();
      socketIo.on("send-data", (lobbyData) => {
        console.log(lobbyData);
        this.players = lobbyData.players;
        this.roomSize = lobbyData.roomSize;
      });
      socketIo.on("invalid-user", (message) => {
        this.$router.push("/");
        this.$q.notify({
          color: "negative",
          textColor: "white",
          icon: "report_problem",
          message: message,
        });
        socketIo.disconnect();
      });
      socketIo.on("lobby-close", (message) => {
        this.$router.push("/");
        this.$q.notify({
          color: "negative",
          textColor: "white",
          icon: "report_problem",
          message: message,
        });
        socketIo.disconnect();
      });
    },
    onSubmit() {
		socketIo.emit("lobby-start");
			
		
     /* api
        .put("/room/start", {
          playerId: localStorage.getItem("playerId"),
        })
        .then((res) => {
          console.log(res);
          this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "cloud_done",
            message: `Game is starting....`,
          });
        })
        .catch((e) => {
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "report_problem",
            message: "Request failed.",
          });
          console.log(e);
        });*/
    },
    onAbort() {
      socketIo.disconnect();
      this.$router.push(`/`);
      this.$q.notify({
        type: "negative",
        color: "negative",
        textColor: "white",
        message: `Left room ${this.$route.params.roomCode}`,
      });
    },
  },
};
</script>
