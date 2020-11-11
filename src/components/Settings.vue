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
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>

      <v-card-text
        class="dlgScroll"
      >
        <v-container
          fluid
        >
          <v-row>
            <v-col>
              <v-switch
                label="Dark theme"
                v-model="dark"
              ></v-switch>
              <p>Switch between light and dark theme on this device.</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                label="Sound"
                v-model="sound"
              ></v-switch>
              <p>Reproduce a sound when starting or stopping a timer.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  data () {
    return {
      mdiClose: mdiClose,
      valid: false,
      dark: this.$store.getters.getSetting('dark'),
      sound: this.$store.getters.getSetting('sound')
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'settings'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'settings' : false)
        this.$store.commit('alert', { show: false })
      }
    }
  },
  watch: {
    dark: async function (value) {
      if (this.dark !== this.$store.getters.getSetting('dark')) {
        await this.$store.dispatch('updateSetting', { key: 'dark', value: this.dark })
      }
    },
    sound: async function (sound) {
      if (!this.$store.state.audioApi && sound) {
        this.$nextTick(() => {
          this.sound = false
          this.$store.commit(
            'alert',
            {
              show: true,
              text: 'Web Audio API is not supported in this browser. Sounds are disabled.',
              type: 'error'
            }
          )
        })
      } else if (this.sound !== this.$store.getters.getSetting('sound')) {
        await this.$store.dispatch('updateSetting', { key: 'sound', value: this.sound })
      }
    }
  },
  methods: {
    async save () {
      try {
        await this.$store.dispatch('updateSetting', { key: 'dark', value: this.dark })
        await this.$store.dispatch('updateSetting', { key: 'sound', value: this.sound })
        this.$store.commit(
          'alert',
          {
            show: true,
            text: 'Settings saved',
            type: 'success'
          }
        )
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
