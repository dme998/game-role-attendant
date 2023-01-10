<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form
        @submit="onSubmit(name, model, playerNum)"
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

        <q-select
          filled
          v-model="this.model"
          label="Ruleset"
          :options="this.rulesetOptions"
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
import { api } from "boot/axios";

const minPlayer = 5;
const maxPlayer = 10;

export default defineComponent({
  name: "HostPage",

  setup() {
    const name = ref(null);
    const playerNum = ref(null);

    return {
      name,
      playerNum,
      minPlayer,
      maxPlayer,

      onReset() {
        name.value = null;
        playerNum.value = null;
      },
    };
  },

  data () {
    return {
      rulesets: {},
      rulesetOptions: ["Secret Hitler"],
      model: "Secret Hitler",
    }
  },

  mounted() {
    this.fetchRulesets();
  },

  methods: {
    fetchRulesets() {
      api.get("/room/rulesets")
        .then((res) => {
        this.rulesets = res.data;
        this.rulesetOptions = Object.keys(this.rulesets);
        this.model = this.rulesetOptions[0];
      })
        .catch((e) => {
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "report_problem",
            message: "Request failed.",
          });
        })
    },

    onSubmit(userName, ruleset, playerNum) {
      api
        .put("/room", {
          userName: userName,
          ruleset: ruleset,
          playerCount: playerNum,
        })
        .then((res) => {
          localStorage.setItem("playerId", res.data.playerId);
          localStorage.setItem("userName", res.data.userName);
          this.$router.push(`/lobby/${res.data.roomCode}`);
          this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "cloud_done",
            message: `Room ${res.data.roomCode} created`,
          });
        })
        .catch((e) => {
          const error = e.response ? e.response.data.errorMessage : "Request Failed."
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "report_problem",
            message: error,
          });
        });
    },
  },
});
</script>
