<template>
  <v-app-bar
    class="v-bar--underline"
    app
    outlined
    flat
  >
    <TimerBtn
      v-if="activeProjectId"
    ></TimerBtn>

    <div
      v-if="activeProjectId"
      class="maintimer"
    >
      <TimerTimeInput
        :session="timerSession"
      ></TimerTimeInput>
    </div>

    <v-spacer></v-spacer>
    <div
      v-if="activeProjectId"
      class="projectWrap"
    >
      <v-select
        :items="projects"
        item-text="title"
        item-value="id"
        v-model="activeProjectId"
        dense
        outlined
        filled
      >

      </v-select>
    </div>
    <v-btn
      class="mr-3"
      v-else
      color="primary"
      @click="showModalComponent('projects')"
    >
      Create your first project
    </v-btn>
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
            @click="showModalComponent('backup')"
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
import { mdiDotsVertical } from '@mdi/js'

export default {
  components: {
    TimerBtn,
    TimerTimeInput
  },
  data: () => ({
    mdiDotsVertical: mdiDotsVertical,
    backup: {}
  }),
  computed: {
    projects () {
      return this.$store.state.projects
    },
    activeProjectId: {
      set (id) {
        if (id !== this.activeProjectId) {
          this.$store.dispatch('updateSetting', { key: 'activeProjectId', value: id })
        }
      },
      get () {
        return this.$store.getters.getSetting('activeProjectId')
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /* main menu with underline like in vuetify.com */
  .theme--dark .v-bar--underline.theme--dark {
      border-bottom-color: rgba(255,255,255,.12)!important;
  }
  .theme--light .v-bar--underline.theme--light {
      border-bottom-color: rgba(0,0,0,.12)!important;
  }
  /* different box shadow for v-dialog-fullscreen with dark theme */
  .v-dialog--fullscreen .v-sheet.theme--dark.v-toolbar:not(.v-sheet--outlined) {
      box-shadow: 0px 2px 4px -1px rgba(255, 255, 255, 0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255, 255, 255, 0.12);
      /* default for dark and light theme
        box-shadow: 0px 2px 4px -1px rgba(255, 255, 255, 0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255, 255, 255, 0.12);
      */
  }

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
