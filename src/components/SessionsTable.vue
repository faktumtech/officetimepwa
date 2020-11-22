<template>
  <v-container
    fluid
    mt-2
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
      :items-per-page="100"
      :footer-props="footerProps"
      :sort-by="'d'"
      :sort-desc="true"
      :loading="loading"
      class="sessionsTable"
      dense
      fixed-header
      height="calc(100vh - 150px)"
    >
    <template
        v-slot:body="{ items }"
      >
        <tbody
          v-if="!items || items.length === 0"
        >
          <tr
            class="noData"
          >
            <td
              colspan="6"
              class="pl-0 pr-0"
            >
              <p
                v-if=loading
                class="text-center pa-4"
              >
                Loading...
              </p>
              <v-alert
                v-else
                :icon="mdiDatabaseOff"
                prominent
                text
                type="info"
              >
                No data yet in this project. Please record your first session.
              </v-alert>
            </td>
          </tr>
        </tbody>
        <tbody
          v-else
        >
          <SessionsTableRow
            v-for="item in items"
            :session="item"
            :key="item.id"
            @row-right-click="rightClick"
          >
          </SessionsTableRow>
        </tbody>
      </template>
    </v-data-table>
    <v-menu
      v-model="contextMenuShow"
      :position-x="contextMenuPosX"
      :position-y="contextMenuPosY"
      :close-on-content-click="false"
    >
      <v-list
        nav
        dense
      >
        <v-list-item
          link
          @click="deleteSession"
        >
          <v-list-item-title>{{ contextMenuSessionIsExpense ? 'Delete expense' : 'Delete session' }}</v-list-item-title>
        </v-list-item>
        <v-hover
          v-if="otherProjects && otherProjects.length > 0"

          v-slot="{ hover }"
        >
        <v-list-group
          :value="hover"
        >
          <template v-slot:activator>
            <v-list-item-title
            >
              Move to project
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="project in otherProjects"
            :key="project.id"
            link
            @click="moveSession(project.id)"
          >
            <v-list-item-icon></v-list-item-icon>
            <v-list-item-title>{{ project.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        </v-hover>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
import SessionsTableRow from '@/components/SessionsTableRow'
import Timer from '@/components/Timer'
import { mdiDatabaseOff } from '@mdi/js'

export default {
  name: 'TimerTable',
  components: {
    SessionsTableRow
  },
  data: () => ({
    mdiDatabaseOff: mdiDatabaseOff,
    headers: [
      { text: '', value: false, sortable: false },
      { text: 'Date', value: 'd' },
      { text: 'Time', value: 't', align: 'end' },
      { text: 'Amount', value: 'a', align: 'end' },
      { text: 'Category', value: 'c' },
      { text: 'Notes', value: 'n' }
    ],
    footerProps: {
      'items-per-page-options': [10, 25, 100, -1]
    },
    loading: false,
    contextMenuShow: false,
    contextMenuPosX: null,
    contextMenuPosY: null,
    contextMenuSessionId: null,
    contextMenuSessionIsExpense: false
  }),
  computed: {
    sessions () {
      return this.$store.state.sessions
    },
    activeProjectId () {
      return this.$store.getters.getSetting('activeProjectId')
    },
    otherProjects () {
      // return this.$store.state.projects
      return this.$store.state.projects.filter((el) => { return el.id !== this.activeProjectId })
    },
    timerSessionId () {
      return this.$store.state.timerSessionId
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
    activeProjectId: {
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
      this.contextMenuPosX = event.clientX
      this.contextMenuPosY = event.clientY
      // console.log('right click', id, this.contextMenuPosX, this.contextMenuPosY)
      this.contextMenuShow = true
    },
    deleteSession: async function () {
      this.contextMenuShow = false
      await this.$store.dispatch('deleteSession', this.contextMenuSessionId)
    },
    moveSession: async function (projectId) {
      this.contextMenuShow = false
      console.log('moveSession', this.contextMenuSessionId, projectId)
      const payload = { id: this.contextMenuSessionId, changes: { p: projectId } }
      await this.$store.dispatch('updateSession', payload)
      await this.$store.dispatch('updateSetting', { key: 'activeProjectId', value: projectId })
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
  /* background: #e4f3fe; */
  /*
  .sessionsTable .selected {
    background-color: currentColor;
    opacity: 0.04;
    outline-style: none;
  }
  */
  /* background: #03a9f4 !important; */

  .sessionsTable.theme--light .selected {
    background-color: #eeeeee !important;;
  }
  .sessionsTable.theme--light .selected:hover {
    background-color: #e1e1e1 !important;;
  }
  .sessionsTable.theme--dark .selected {
    background-color: #616161 !important;;
  }
  .sessionsTable.theme--dark .selected:hover {
    background-color: #6e6e6e !important;;
  }
  .noData:hover {
    background-color: inherit !important;
  }

</style>
