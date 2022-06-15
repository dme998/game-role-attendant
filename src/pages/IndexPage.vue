<template>
  <q-page class="flex flex-center">
    <div class="column">
      <q-btn color="primary" label="HOST" size="xl" />
      <div class="flex-break q-py-md"></div>
      <div class="text-center" style="font-size: xxx-large">OR</div>
      <div class="flex-break q-py-md"></div>
      <q-btn color="secondary" label="JOIN" size="xl" />
      <div class="flex-break q-py-lg"></div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>
