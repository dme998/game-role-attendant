<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form @submit="onSubmit(name, model)" @reset="onReset" class="q-gutter-md">
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

        <q-select
          filled
          v-model="model"
          label="Ruleset"
          :options="stringOptions"
          behavior="menu"
        />

        <q-input
          filled
          type="number"
          v-model="playerNum"
          label="Number of players"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please select amount of players',
            (val) =>
              (val >= minPlayer && val <= maxPlayer) ||
              `Please select within ${minPlayer} ➡️ ${maxPlayer} players`,
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
import { defineComponent } from "vue";
import { ref } from "vue";
import { api } from "boot/axios"
import { useQuasar } from "quasar";

const stringOptions = ["Secret Hitler"];
const minPlayer = 5;
const maxPlayer = 10;

export default defineComponent({
  name: "HostPage",

  setup() {
    const $q = useQuasar();

    const name = ref(null);
    const playerNum = ref(null);
    const options = ref(stringOptions);
    const model = ref("Secret Hitler")

    return {
      name,
      playerNum,
      model,
      stringOptions,
      options,
      minPlayer,
      maxPlayer,

      onReset() {
        name.value = null;
        playerNum.value = null;
      },
    };
  },
  methods: {
    onSubmit(userName, ruleset) {
      api.put('/room', {
        userName: userName,
        ruleset: ruleset,
        isHost: true
      })
        .then((res) => {
          console.log(res)
          this.$router.push(`/lobby/${res.data.roomCode}`)
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: `Room ${res.data.roomCode} created`,
          });
        })
        .catch((e) => {
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "report_problem",
            message: "Request failed.",
          });
          console.log(e)
        })
    },
  }
});
</script>
