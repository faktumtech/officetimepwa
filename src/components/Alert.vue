<template>
  <v-snackbar
    :value="show"
    :color="color"
    :timeout="-1"
    text
  >
    <v-icon
      :color="color"
      class="mr-4"
    >
      {{ icon }}
    </v-icon>
    {{ alert.text }}
    <v-btn
      text
      @click.stop="show = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
/**
 * Alert component that uses v-snackbar
 * use 'no-click-animation' and 'persistent' when using in modal (v-dialog)
 */
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
          this.icon = 'mdi-thumb-up'
          break
        case 'warning':
          this.color = 'warning'
          this.icon = '{{ mdiAlert }}'
          break
        case 'error':
          this.color = 'error'
          this.icon = '{{ mdiAlert }}'
          break
        default:
          this.color = 'info'
          this.icon = 'mdi-information'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
