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
        class="dlgScroll"
      >
        <AboutText></AboutText>
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
                      <td><b>{{ $store.getters.getSetting('lastBackup') }}</b></td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="8"
              offset-md="2"
              lg="6"
              offset-lg="3"
              xl="4"
              offset-xl="4"
              class="text-center"
            >
              <v-btn
                color="warning"
                x-large
                @click="mockSessions"
              >
                Add 10000 sessions with random<br>data to actual project
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '@/db'
import AboutText from '@/components/AboutText'
import { mdiClose } from '@mdi/js'

export default {
  data: () => ({
    mdiClose: mdiClose
  }),
  components: {
    AboutText
  },
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'about'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'about' : false)
      }
    }
  },
  methods: {
    mockSessions: async function (params) {
      await db.mockSessions(this.$store.getters.getSetting('activeProjectId'), 10000)
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
