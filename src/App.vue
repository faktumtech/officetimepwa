<template>
  <v-app>
    <AppBar></AppBar>
    <v-main>
      <SessionsTable
        v-if="activeProjectId"
      ></SessionsTable>
      <Greeting
        v-else
      ></Greeting>
      <!--
        use v-if or eager on v-dialog until focus bug is solved
        https://github.com/vuetifyjs/vuetify/issues/11257
       -->
      <Projects></Projects>
      <Categories></Categories>
      <Reports></Reports>
      <Settings></Settings>
      <Backup></Backup>
      <Import></Import>
      <About></About>
      <AddExpense></AddExpense>
    </v-main>
    <ModalDlg></ModalDlg>
    <Alert></Alert>
  </v-app>
</template>

<script>
import SwUpdate from '@/mixins/SwUpdate'
import AppBar from '@/components/AppBar'
import ModalDlg from '@/components/ModalDlg'
import Alert from '@/components/Alert'
import SessionsTable from '@/components/SessionsTable'
import Projects from '@/components/Projects'
import Categories from '@/components/Categories'
import Settings from '@/components/Settings'
import Backup from '@/components/Backup'
import About from '@/components/About'
import Greeting from '@/components/Greeting'
import Reports from '@/components/Reports'
import Import from '@/components/Import'
import AddExpense from '@/components/AddExpense'

export default {
  name: 'App',
  mixins: [SwUpdate],
  components: {
    ModalDlg,
    Alert,
    AppBar,
    SessionsTable,
    Projects,
    Settings,
    Categories,
    Reports,
    Backup,
    About,
    Greeting,
    Import,
    AddExpense
  },
  data () {
    return {
    }
  },
  computed: {
    dark () {
      return this.$store.getters.getSetting('dark')
    },
    activeProjectId () {
      return this.$store.getters.getSetting('activeProjectId')
    }
  },

  watch: {
    dark: {
      handler: function (dark) {
        this.$vuetify.theme.dark = dark
      },
      // the callback will be called immediately after the start of the observation
      immediate: true
    }
  },

  mounted: function () {
    this.init()
  },
  methods: {
    init: async function () {
      // use web audio api
      // https://stackoverflow.com/questions/29567580/play-a-beep-sound-on-button-click
      // check for  audio api
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      const audioApi = (typeof (window.AudioContext) !== 'undefined')
      this.$store.commit('audioApi', audioApi)
      /*
      try {
        if (audioApi) {
          this.audioContext = new AudioContext()
        }
      } catch (e) {
        this.$store.commit(
          'alert',
          {
            show: true,
            text: 'Web Audio API is not supported in this browser. Sounds are disabled.',
            type: 'error'
          }
        )
      }
      */
      // check for clipboard api
      this.$store.commit('clipboardApi', (typeof (navigator.clipboard) !== 'undefined'))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /*
    primary light: #16b1e7
  */
  html {
    overflow: hidden;
  }

  /* make toolbar of fullscreen dialog sticky and scroll element after toolbar */
  .dlgSticky {
    position: sticky !important;
  }
  .dlgScroll {
    overflow-y: auto !important;
    height: Calc(100vh - 64px) !important;
  }

  /* create elevation box-shadow for dark theme */
  .v-application.theme--dark .elevation-1 {
    box-shadow: 0 2px 1px -1px rgba(255,255,255,.2),0 1px 1px 0 rgba(255,255,255,.14),0 1px 3px 0 rgba(255,255,255,.12)!important;
  }
  .v-application.theme--dark .elevation-2 {
      box-shadow: 0 3px 1px -2px rgba(255,255,255,.2),0 2px 2px 0 rgba(255,255,255,.14),0 1px 5px 0 rgba(255,255,255,.12)!important;
  }
  .v-application.theme--dark .elevation-3 {
      box-shadow: 0 3px 3px -2px rgba(255,255,255,.2),0 3px 4px 0 rgba(255,255,255,.14),0 1px 8px 0 rgba(255,255,255,.12)!important;
  }
  .v-application.theme--dark .elevation-4 {
      box-shadow: 0 2px 4px -1px rgba(255,255,255,.2),0 4px 5px 0 rgba(255,255,255,.14),0 1px 10px 0 rgba(255,255,255,.12)!important;
  }
  .v-application.theme--dark .elevation-5 {
      box-shadow: 0 3px 5px -1px rgba(255,255,255,.2),0 5px 8px 0 rgba(255,255,255,.14),0 1px 14px 0 rgba(255,255,255,.12)!important;
  }
  .v-application.theme--dark .elevation-6 {
      box-shadow: 0 3px 5px -1px rgba(255,255,255,.2),0 6px 10px 0 rgba(255,255,255,.14),0 1px 18px 0 rgba(255,255,255,.12)!important;
  }

  /* create v-dialog box-shadow for dark theme */
  .v-application.theme--dark .v-dialog {
      box-shadow: 0 11px 15px -7px rgba(255,255,255,.2), 0 24px 38px 3px rgba(255,255,255,.14), 0 9px 46px 8px rgba(255,255,255,.12);
  }

</style>
