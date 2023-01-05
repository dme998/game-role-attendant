<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form
        @submit="onSubmit(name, room)"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="name"
          label="User Name"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter a username!',
            (val) => {
              name = val.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 12);
            },
          ]"
        />

        <q-input
          filled
          v-model="room"
          label="Room Code"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter a room code!',
            (val) => (val && val.length <= 4) || 'Invalid room code',
          ]"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

export default {
  name: "JoinPage",

  setup() {
    const $q = useQuasar();

    const name = ref(null);
    const room = ref(null);

    return {
      name,
      room,

      onReset() {
        name.value = null;
        room.value = null;
      },
    };
  },
  methods: {
    onSubmit(userName, room) {
      api
        .put("/room/join", {
          userName: userName,
          roomCode: room,
        })
        .then((res) => {
          localStorage.setItem("playerId", res.data.playerId);
          localStorage.setItem("userName", res.data.userName);
          this.$router.push(`/lobby/${res.data.roomCode}`);
          this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "cloud_done",
            message: `Room ${res.data.roomCode} joined`,
          });
        })
        .catch((e) => {
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "report_problem",
            message: e.response.data.errorMessage,
          });
        });
    },
  },
};
</script>
