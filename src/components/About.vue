<template>
  <v-dialog
    fullscreen
    hide-overlay
    persistent
    no-click-animation
    eager
    :value="show"
    @keydown.esc="show = false"
    class="dlgSticky"
  >
    <v-card>
      <v-toolbar
      >
        <v-btn
          icon
          @click="show = false"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title>About</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text
        class="dlgScroll pa-0"
      >
        <v-container
          fluid
        >
          <v-row>
            <v-col
              cols="12"
              md="8"
              offset-md="2"
              lg="6"
              offset-lg="3"
              xl="4"
              offset-xl="4"
            >
              <p
                class="text-h4 primary--text"
              >
                <v-icon
                  x-large
                  class="mr-3"
                >
                  $vuetify.icons.logo
                </v-icon>
                OfficeTimePwa
              </p>
              <p
                class="body-1"
              >
                Time tracking tool for freelancers. Heavely inspired by OfficeTime. All data is stored locally in the browser (through IndexedDB) and is never send to any server.
              </p>
              <p
                class="body-1"
              >
                This application is designed as a Progressive Web Application (PWA) and once installed ('Add to desktop') it can be used offline.
              </p>
              <p
                class="body-1"
              >
                Copyright <b>cfbutt</b>. Licensed under GPL v3.
              </p>
              <p
                class="body-1"
              >
                Source code at <a target="_blank" rel="noopener noreferrer" href="https://github.com/cfbutt/officetimepwa">https://github.com/cfbutt/officetimepwa</a>.
              </p>
            </v-col>
            <v-col
              cols="12"
              md="8"
              offset-md="2"
              lg="6"
              offset-lg="3"
              xl="4"
              offset-xl="4"
            >
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th colspan="2">
                        System properties
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                    >
                      <td>App Version:</td>
                      <td><b>{{ $store.state.appVersion }}</b></td>
                    </tr>
                    <tr
                    >
                      <td>DB Version:</td>
                      <td><b>{{ $store.state.dbVersion }}</b></td>
                    </tr>
                    <tr
                    >
                      <td>Clipboard Api support:</td>
                      <td><b>{{ $store.state.clipboardApi }}</b></td>
                    </tr>
                    <tr
                    >
                      <td>Audio Api support:</td>
                      <td><b>{{ $store.state.audioApi }}</b></td>
                    </tr>
                    <tr
                    >
                      <td>Last backup:</td>
                      <td><b>{{ lastBackupDateStr }}</b></td>
                    </tr>
                    <tr
                    >
                      <td
                        colspan="2"
                        class="text-center"
                        style="border-bottom: none"
                      >
                        <v-btn
                          color="primary"
                          text
                          @click="reload"
                        >
                          Reload app
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Utils from '@/utils/Utils'
import db from '@/db'
import { mdiClose, mdiDeleteAlert } from '@mdi/js'

export default {
  data: () => ({
    mdiClose: mdiClose,
    mdiDeleteAlert: mdiDeleteAlert
  }),
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'about'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'about' : false)
      }
    },
    activeProjectId () {
      return this.$store.getters.getSetting('activeProjectId')
    },
    lastBackupDateStr () {
      const lastBackupDate = this.$store.getters.getSetting('lastBackupDate')
      return lastBackupDate ? Utils.formatDateToLocalDateTimeIsoStr(new Date(lastBackupDate)) : 'never'
    }
  },
  methods: {
    mockSessions: async function (params) {
      await db.mockSessions(this.$store.getters.getSetting('activeProjectId'), 10000)
      this.reload()
    },
    reload: function () {
      window.location.reload()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  tr:hover{
    background: none !important;
  }
</style>
