<template>
  <v-snackbar
    :value="show"
    :color="color"
    :timeout="-1"
    elevation="4"
    text
    multi-line
    class="v-snack--has-background"
  >
    <v-container
      class="pa-0"
    >
      <v-row
      >
        <v-col
          cols="auto"
        >
          <v-icon
            :color="color"
            class="mr-4"
          >
            {{ icon }}
          </v-icon>
        </v-col>
        <v-col
        >
          {{ alert.text }}
        </v-col>
        <v-col
          cols="auto"
        >
          <v-btn
            text
            @click.stop="show = false"
          >
            Close
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-snackbar>
</template>

<script>
/**
 * Alert component that uses v-snackbar
 * use 'no-click-animation' and 'persistent' when using in modal (v-dialog)
 */
import { mdiThumbUp, mdiInformation, mdiAlert, mdiAlertOctagon } from '@mdi/js'

export default {
  data () {
    return {
      show: false,
      icon: null,
      color: null,
      timeout: null
    }
  },
  computed: {
    alert () {
      return this.$store.state.alert
    },
    modalComponent () {
      return this.$store.state.showModalComponent === 'backup'
    },
    modalDlg () {
      return this.$store.state.modalDlg.show
    }
  },
  watch: {
    alert: {
      handler: function (alert) {
        this.actualize(alert)
      },
      // the callback will be called immediately after the start of the observation
      immediate: true
    },
    show: function (value) {
      this.$store.commit('alert', { show: value })
    },
    // close alert if opening or closing any modal
    modalComponent: function () {
      this.hide()
    },
    modalDlg: function () {
      this.hide()
    }
  },
  methods: {
    actualize: function (alert) {
      // hide / show
      if (this.show !== alert.show) {
        this.show = alert.show
      }
      // start timer
      if (this.show && alert.timeout) {
        this.timeout = setTimeout(() => {
          this.show = false
        }, alert.timeout)
      }
      // cancel timer
      if (!this.show && this.timeout) {
        clearTimeout(this.timeout)
      }

      // set icons automatically
      switch (alert.type) {
        case 'success':
          this.color = 'success'
          this.icon = mdiThumbUp
          break
        case 'warning':
          this.color = 'warning'
          this.icon = mdiAlert
          break
        case 'error':
          this.color = 'error'
          this.icon = mdiAlertOctagon
          break
        default:
          this.color = 'info'
          this.icon = mdiInformation
      }
    },
    hide: function () {
      if (this.show) {
        this.show = false
        // cancel timer
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
