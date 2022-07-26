<template>
  <q-page class="flex flex-center">
    <div class="column">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-list bordered padding id="player-list">
          <q-item>
            <q-item-section>
              <q-item-label overline>ROOM CODE: A8ZV5</q-item-label>
              <q-item-label></q-item-label>
            </q-item-section>
          </q-item>
          <q-item-label header>Player List</q-item-label>

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
import { useQuasar } from "quasar";

export default {
  name: "LobbyPage",

  setup() {
    const $q = useQuasar();

    return {
      onSubmit() {
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted!",
        });
      },

      onAbort() {
        $q.notify({
          color: "red-5",
          textColor: "white",
          type: "negative",
          message: "Aborted!",
        });
      },
    };
  },

  data() {
    return {
      players: {
        player1: {
          id: 0,
          userName: "Tut_k0",
          isHost: true,
        },
        player2: {
          id: 1,
          userName: "dme_998",
          isHost: false,
        },
        player3: {
          id: 2,
          userName: "Drizz",
          isHost: false,
        },
        player4: {
          id: 3,
          userName: "Finne",
          isHost: false,
        },
        player5: {
          id: 4,
          userName: "Scav From Tarkov",
          isHost: false,
        },
        player6: {
          id: 5,
          userName: "Turtle",
          isHost: false,
        },
      },
    };
  },
};
</script>
