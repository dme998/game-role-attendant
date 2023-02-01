<template>
  <div
    :style="pageColor"
    class="fullscreen text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 15vh; animation: fadeIn 2s">
        {{ this.info.role }}
      </div>
      <div style="font-size: 2vh; animation: fadeIn 5s">
        {{ this.info.roleMessage }}
      </div>
      <div class="flex-break q-py-xl"></div>
      <div class="flex-break q-py-xl"></div>
      <q-btn
        style="animation: fadeIn 8s"
        to="/"
        color="dark"
        label="Another game then?"
        size="xl"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "RoleResultPage",

  data() {
    return {
      info: {},
      colorMapping: {
        info: "#31ccec",
        negative: "#c10015",
        maroon: "#630016",
      },
    };
  },

  mounted() {
    this.populateInfo();
  },

  methods: {
    populateInfo() {
      this.info["role"] = localStorage.getItem("role");
      this.info["color"] = this.colorMapping[localStorage.getItem("color")];
      this.info["roleMessage"] = localStorage.getItem("roleMessage");
    },
  },
  computed: {
    pageColor() {
      return { "background-color": this.info.color };
    },
  },
});
</script>
