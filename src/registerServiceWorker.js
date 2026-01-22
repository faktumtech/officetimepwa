
import { registerSW } from 'virtual:pwa-register'

if (import.meta.env.PROD) {
  let swRegistration = null

  registerSW({
    onRegistered (registration) {
      swRegistration = registration
      console.log('Service worker has been registered.')
    },
    onRegisterError (error) {
      console.error('Error during service worker registration:', error)
    },
    onNeedRefresh () {
      if (swRegistration) {
        document.dispatchEvent(
          new CustomEvent('swUpdated', { detail: swRegistration })
        )
      }
    },
    onOfflineReady () {
      console.log('Content has been cached for offline use.')
    }
  })
}
