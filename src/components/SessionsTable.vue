<template>
  <v-container
    class="mt-2"
    fluid
  >
    <!--
      :items-per-page="100"
      hide-default-footer
      disable-pagination
      :items-per-page-options=[ 10, 25, 100, -1 ]
      pending: implement virtual scroll
      https://codepen.io/eddie1952/pen/jObPvKO
    -->
    <v-data-table
      :mobile-breakpoint="0"
      :headers="headers"
      :items="sessions"
      :items-per-page="itemsPerPage"
      @update:items-per-page="(val) => { itemsPerPage = val }"
      :items-per-page-options="itemsPerPageOptions"
      :sort-by="[{ key: 'd', order: 'desc' }]"
      :loading="loading"
      class="sessionsTable"
      density="compact"
      fixed-header
      height="calc(100vh - 150px)"
    >
      <template v-slot:item="{ item }">
        <SessionsTableRow
          :session="item.raw || item"
          :key="item.raw ? item.raw.id : item.id"
          @row-right-click="rightClick"
        />
      </template>
      <template v-slot:no-data>
        <div class="noData">
          <p
            v-if="loading"
            class="text-center pa-4"
          >
            Loading...
          </p>
          <v-alert
            v-else
            icon="$mdiDatabaseOff"
            prominent
            variant="text"
            type="info"
          >
            No data yet in this project. Please record your first session.
          </v-alert>
        </div>
      </template>
    </v-data-table>
    <v-menu
      v-model="contextMenuShow"
      :target="contextMenuTarget"
      :close-on-content-click="false"
    >
      <v-list
        nav
        density="compact"
      >
        <v-list-item
          link
          @click="deleteSession"
        >
          <v-list-item-title>{{ contextMenuSessionIsExpense ? 'Delete expense' : 'Delete session' }}</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-if="otherProjects && otherProjects.length > 0"
          v-model="moveGroupOpen"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Move to project" />
          </template>
          <v-list-item
            v-for="project in otherProjects"
            :key="project.id"
            link
            @click="moveSession(project.id)"
            :title="project.title"
          />
        </v-list-group>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
import SessionsTableRow from '@/components/SessionsTableRow'
import Timer from '@/components/Timer'

export default {
  name: 'TimerTable',
  components: {
    SessionsTableRow
  },
  data: () => ({
    headers: [
      { title: '', key: 'timer', sortable: false },
      { title: 'Date', key: 'd' },
      { title: 'Time', key: 't', align: 'end' },
      { title: 'Amount', key: 'a', align: 'end' },
      { title: 'Category', key: 'c' },
      { title: 'Notes', key: 'n' }
    ],
    itemsPerPageOptions: [10, 25, 100, -1],
    loading: false,
    contextMenuShow: false,
    contextMenuTarget: null,
    contextMenuSessionId: null,
    contextMenuSessionIsExpense: false,
    moveGroupOpen: false
  }),
  computed: {
    sessions () {
      return this.$store.state.sessions
    },
    selectedProjectId () {
      return this.$store.getters.getSetting('selectedProjectId')
    },
    otherProjects () {
      // return this.$store.state.projects.filter((el) => { return el.id !== this.selectedProjectId })
      // exclude archived projects
      return this.$store.getters.getProjects(true).filter((el) => { return el.id !== this.selectedProjectId })
    },
    timerSessionId () {
      return this.$store.state.timerSessionId
    },
    itemsPerPage: {
      async set (value) {
        console.log('test')
        await this.$store.dispatch('updateSetting', { key: 'itemsPerPageSessionTable', value: value })
      },
      get () {
        return this.$store.getters.getSetting('itemsPerPageSessionTable')
      }
    },
    selectedSessionId: {
      set (value) {
        this.$store.commit('selectedSessionId', value)
      },
      get () {
        return this.$store.state.selectedSessionId
      }
    }
  },
  watch: {
    selectedProjectId: {
      immediate: true,
      handler: async function (id) {
        console.log('new projectId', id)
        Timer.stop()
        this.loading = true
        await this.$store.dispatch('getSessionsByProjectId', id)
        this.selectedSessionId = null
        this.loading = false
      }
    }
  },
  methods: {
    rightClick: function (id, event) {
      this.contextMenuSessionId = id
      this.contextMenuSessionIsExpense = this.$store.getters.getSession(id).e
      this.contextMenuTarget = event.target
      // console.log('right click', id, this.contextMenuPosX, this.contextMenuPosY)
      this.contextMenuShow = true
    },
    deleteSession: async function () {
      if (this.timerSessionId === this.contextMenuSessionId) {
        Timer.stop()
      }
      this.contextMenuShow = false
      await this.$store.dispatch('deleteSession', this.contextMenuSessionId)
    },
    moveSession: async function (projectId) {
      if (this.timerSessionId === this.contextMenuSessionId) {
        Timer.stop()
      }
      this.contextMenuShow = false
      console.log('moveSession', this.contextMenuSessionId, projectId)
      const payload = { id: this.contextMenuSessionId, changes: { p: projectId } }
      await this.$store.dispatch('updateSession', payload)
      await this.$store.dispatch('updateSetting', { key: 'selectedProjectId', value: projectId })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .v-data-table.sessionsTable tr > th,
  .v-data-table.sessionsTable tr > td {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .v-data-table.sessionsTable tr.noData > td {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .sessionsTable tr {
    outline-style: none;
  }
  .sessionsTable .v-data-table__wrapper {
    overflow-x: auto;
  }
  .sessionsTable tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  .sessionsTable.v-theme--dark tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.28);
  }
  .sessionsTable.v-theme--dark tbody tr > td {
    border-bottom-color: rgba(255, 255, 255, 0.28) !important;
  }
  .sessionsTable.v-theme--dark thead th {
    border-bottom-color: rgba(255, 255, 255, 0.28) !important;
  }
  .sessionsTable.v-theme--light tbody tr > td {
    border-bottom-color: rgba(0, 0, 0, 0.12) !important;
  }
  .sessionsTable.v-theme--light thead th {
    border-bottom-color: rgba(0, 0, 0, 0.12) !important;
  }
  .sessionsTable tbody tr:hover .v-field,
  .sessionsTable tbody tr:hover .v-field__overlay,
  .sessionsTable tbody tr:hover .v-field__outline,
  .sessionsTable tbody tr:hover .v-field__field input {
    background-color: transparent !important;
  }
  /* background: #e4f3fe; */
  /*
  .sessionsTable .selected {
    background-color: currentColor;
    opacity: 0.04;
    outline-style: none;
  }
  */
  /* background: #03a9f4 !important; */

  .sessionsTable .selected,
  .sessionsTable .selected:hover {
    background-color: transparent !important;
  }
  .noData:hover {
    background-color: inherit !important;
  }

</style>
