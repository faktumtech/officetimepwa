<template>
  <v-app-bar
    class="v-bar--underline"
    flat
    border
  >
    <TimerBtn
      v-if="selectedProjectId"
    />

    <div
      v-if="selectedProjectId"
      class="maintimer"
    >
      <TimerTimeInput
        :session="timerSession"
      />
    </div>

    <v-spacer />
    <div
      v-if="selectedProjectId"
      class="projectWrap"
    >
      <v-select
        :items="activeProjects"
        item-title="title"
        item-value="id"
        v-model="selectedProjectId"
        density="compact"
        variant="outlined"
      />
    </div>

    <v-menu
      v-if="selectedProjectId"
      location="bottom"
      offset="8"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="mr-2"
          icon
          v-bind="props"
          aria-label="Settings"
        >
          <v-icon icon="$mdiPlus" />
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          link
          @click="addSession()"
          aria-label="Add session"
        >
          <v-list-item-title>Add session</v-list-item-title>
        </v-list-item>
        <v-list-item
          link
          @click="showModalComponent('addExpense')"
          aria-label="Add expense"
        >
          <v-list-item-title>Add expense</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      location="bottom"
      offset="8"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          v-bind="props"
          aria-label="Menu"
        >
          <v-icon icon="$mdiDotsVertical" />
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          link
          @click="showModalComponent('reports')"
          aria-label="Reports"
        >
          <v-list-item-title>Reports</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item
          link
          @click="showModalComponent('projects')"
          aria-label="Projects"
        >
          <v-list-item-title>Projects</v-list-item-title>
        </v-list-item>
        <v-list-item
          link
          @click="showModalComponent('categories')"
          aria-label="Categories"
        >
          <v-list-item-title>Categories</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item
          link
          @click="showModalComponent('import')"
          aria-label="Import"
        >
          <v-list-item-title>Import</v-list-item-title>
        </v-list-item>
        <v-list-item
          link
          @click="showModalComponent('backups')"
          aria-label="Backups"
        >
          <v-list-item-title>Backups</v-list-item-title>
        </v-list-item>
        <v-list-item
          link
          @click="showModalComponent('settings')"
          aria-label="Settings"
        >
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-list-item
          link
          @click="showModalComponent('about')"
          aria-label="About"
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

export default {
  components: {
    TimerBtn,
    TimerTimeInput
  },
  data: () => ({
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
    addSession: async function () {
      await this.$store.dispatch('createSession', this.selectedProjectId)
    },
    addExpense: function () {
      this.$store.commit('showModalComponent', 'addExpense')
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
    background-color: transparent;
  }

  .maintimer .timerTimeInput {
    font-weight: bold;
  }

  .maintimer .timerTimeInput input {
    padding: 0 !important;
    height: 35px !important;
    background-color: transparent !important;
    font-weight: bold;
  }
  .maintimer .v-field,
  .maintimer .v-field__field,
  .maintimer .v-field__field input,
  .maintimer .v-field__overlay,
  .maintimer .v-field__outline {
    background-color: transparent !important;
  }

  .maintimer .v-input__details {
    display: none;
  }

  .v-app-bar {
    padding-left: 12px;
    padding-right: 12px;
  }
  .v-app-bar.v-theme--light {
    background-color: #f2f2f2;
  }

  .v-application.v-theme--dark .v-bar--underline.v-theme--dark {
    border-bottom-color: rgba(255, 255, 255, 0.3) !important;
    border-bottom-width: 2px;
}

</style>
