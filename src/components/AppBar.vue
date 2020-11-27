<template>
  <v-app-bar
    class="v-bar--underline"
    app
    outlined
    flat
  >
    <TimerBtn
      v-if="selectedProjectId"
    ></TimerBtn>

    <div
      v-if="selectedProjectId"
      class="maintimer"
    >
      <TimerTimeInput
        :session="timerSession"
      ></TimerTimeInput>
    </div>

    <v-spacer></v-spacer>
    <div
      v-if="selectedProjectId"
      class="projectWrap"
    >
      <v-select
        :items="activeProjects"
        item-text="title"
        item-value="id"
        v-model="selectedProjectId"
        dense
        outlined
        filled
      >
      </v-select>
    </div>

    <v-menu
      v-if="selectedProjectId"
      bottom
      left
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mr-2"
          icon
          v-bind="attrs"
          v-on="on"
          aria-label="Settings"
        >
          <v-icon>{{ mdiPlus }}</v-icon>
        </v-btn>
      </template>
        <v-list>
          <v-list-item
            link
            @click="addSession()"
          >
            <v-list-item-title>Add session</v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            @click="showModalComponent('addExpense')"
          >
            <v-list-item-title>Add expense</v-list-item-title>
          </v-list-item>
        </v-list>
    </v-menu>

    <v-menu
      bottom
      left
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
          aria-label="Settings"
        >
          <v-icon>{{ mdiDotsVertical }}</v-icon>
        </v-btn>
      </template>
        <v-list>
          <v-list-item
            link
            @click="showModalComponent('projects')"
          >
            <v-list-item-title>Projects</v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            @click="showModalComponent('categories')"
          >
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            link
            @click="showModalComponent('reports')"
          >
            <v-list-item-title>Reports</v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            @click="showModalComponent('import')"
          >
            <v-list-item-title>Import</v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            @click="showModalComponent('backups')"
          >
            <v-list-item-title>Backups</v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            @click="showModalComponent('settings')"
          >
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            @click="showModalComponent('about')"
          >
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
        </v-list>
    </v-menu>

  </v-app-bar>
</template>

<script>
import TimerBtn from '@/components/TimerBtn'
import TimerTimeInput from '@/components/TimerTimeInput'
import { mdiDotsVertical, mdiPlus } from '@mdi/js'

export default {
  components: {
    TimerBtn,
    TimerTimeInput
  },
  data: () => ({
    mdiDotsVertical: mdiDotsVertical,
    mdiPlus: mdiPlus,
    backup: {}
  }),
  computed: {
    activeProjects () {
      // exclude archived projects
      return this.$store.getters.getProjects(true)
    },
    selectedProjectId: {
      async set (id) {
        if (id !== this.selectedProjectId) {
          await this.$store.dispatch('updateSetting', { key: 'selectedProjectId', value: id })
        }
      },
      get () {
        return this.$store.getters.getSetting('selectedProjectId')
      }
    },
    timerSessionId () {
      return this.$store.state.timerSessionId
    },
    timerSession () {
      return this.$store.getters.getSession(this.timerSessionId)
    }
  },
  methods: {
    showModalComponent: function (component) {
      this.$store.commit('showModalComponent', component)
    },
    addSession: async function (component) {
      await this.$store.dispatch('createSession', this.selectedProjectId)
    },
    addExpense: function (component) {
      this.$store.commit('showModalComponent', component)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .projectWrap {
    margin-top: 28px;
    width: 250px;
    max-width: 35%;
    margin-right: 20px;
  }

  .maintimer {
    margin-left: 30px;
    margin-top: 10px;
  }

  .maintimer .timerTimeInput {
    font-weight: bold;
  }
</style>
