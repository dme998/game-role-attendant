<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          v-model="name"
          label="User Name"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter a username!',
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
    const accept = ref(false);
    const options = ref(stringOptions);

    return {
      name,
      playerNum,
      accept,
      model: ref("Secret Hitler"),
      stringOptions,
      options,
      minPlayer,
      maxPlayer,

      onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "You need to accept the license and terms first",
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted",
          });
        }
      },

      onReset() {
        name.value = null;
        playerNum.value = null;
        accept.value = false;
      },
    };
  },
});
</script>
