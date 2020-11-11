import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './registerServiceWorker'
import store from './store'
import ErrorMsg from './components/ErrorMsg'
import LongPress from './directives/longpress'

Vue.directive('longpress', LongPress)

Vue.config.productionTip = false

// indexedDB support is required for this app
if (window.indexedDB) {
  // get initial data from db and commit to store
  store.dispatch('initApp')
    .then(() => {
      new Vue({
        vuetify,
        store,
        render: h => h(App)
      }).$mount('#app')
    })
    .catch((err) => {
      showErr('Error:' + err)
    })
} else {
  showErr('Your browser doesn\'t support a stable version of IndexedDB Api!')
}

// mount minium vue error page
function showErr (msg) {
  /* eslint-disable no-new */
  new Vue({
    vuetify,
    render: h => h(ErrorMsg, {
      props: {
        msg: msg
      }
    })
  }).$mount('#app')
}
