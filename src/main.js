import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import { pinia, legacyStore as store } from './store'
import App from './App.vue'
import ErrorMsg from './components/ErrorMsg'
import LongPress from './directives/longpress'
import './registerServiceWorker'

// indexedDB support is required for this app
if (window.indexedDB) {
  // get initial data from db and commit to store
  store.dispatch('initApp')
    .then(() => {
      mountApp(App)
    })
    .catch((err) => {
      showErr('Error:' + err)
    })
} else {
  showErr('Your browser doesn\'t support a stable version of IndexedDB Api!')
}

// mount minium vue error page
function showErr (msg) {
  mountApp(ErrorMsg, { msg })
}

function mountApp (RootComponent, props = {}) {
  const app = createApp(RootComponent, props)
  app.use(vuetify)
  app.use(pinia)
  app.config.globalProperties.$store = store
  app.directive('longpress', LongPress)
  app.mount('#app')
}
