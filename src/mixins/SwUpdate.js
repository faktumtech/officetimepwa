// src/mixins/SwUpdate.js
// https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
import EventBus from '@/components/EventBus'

export default {
  data () {
    return {
      refreshing: false,
      registration: null
    }
  },

  created () {
    // Listen for our custom event from the SW registration
    document.addEventListener('swUpdated', this.updateAvailable, { once: true })

    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!this.refreshing) {
        this.refreshing = true
        // Here the actual reload of the page occurs
        window.location.reload()
      }
    })
  },

  methods: {
    // Store the SW registration so we can send it a message
    updateAvailable (event) {
      this.registration = event.detail
      const modalDlg = {
        title: 'Update available',
        text: 'An update of this app is available. Please refresh',
        cancelText: 'Not now',
        confirmText: 'Refresh'
      }
      this.$store.commit('showModalDlg', modalDlg)
      EventBus.$on('modalEvent', (e) => {
        EventBus.$off('modalEvent')
        if (e === 'confirm') {
          this.refreshApp()
        }
        this.$store.commit('hideModalDlg')
      })
    },

    // Called when the user accepts the update
    refreshApp () {
      this.updateExists = false
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (this.registration && this.registration.waiting) {
        // send message to SW to skip the waiting and activate the new SW
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    }

  }
}
