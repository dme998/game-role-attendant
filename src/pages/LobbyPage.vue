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

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User Avatar"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Tut_k0</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="star" color="yellow" />
            </q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User Avatar"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>dme_998</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User Avatar"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Drizz</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User Avatar"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Finne</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User Avatar"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Scav From Tarkov</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User Avatar"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Turtle</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <div style="text-align: center; padding-top: 3px">
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
            <q-btn label="Leave" type="button" color="negative"></q-btn>
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
          color: "red-2",
          textColor: "white",
          icon: "cloud_done",
          message: "Aborted!",
        });
      },
    };
  },
};
</script>
