<template>
  <q-layout view="lHr lpR lfr">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title
          class="text-left"
          @click="$router.replace('/')"
          style="cursor: pointer"
        >
          <!-- padding-left: 123.63px" //sizeof Dark Mode element -->
          <q-avatar>
            <img
              src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"
              alt="logo"
            />
          </q-avatar>
          Game Role Attendant
        </q-toolbar-title>
        <q-toggle v-model="value" color="dark" label="Dark Mode" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { watch } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",
  setup() {
    const $q = useQuasar();

    let value = ref(true);

    $q.dark.set(value.value);

    watch(
      () => value.value,
      (val) => {
        $q.dark.set(val);
      }
    );
    return {
      value,
    };
  },
});
</script>
