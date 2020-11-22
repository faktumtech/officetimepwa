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
      <Backups></Backups>
      <Imports></Imports>
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
import Backups from '@/components/Backups'
import About from '@/components/About'
import Greeting from '@/components/Greeting'
import Reports from '@/components/Reports'
import Imports from '@/components/Imports'
import AddExpense from '@/components/AddExpense'
import EventBus from '@/components/EventBus'

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
    Backups,
    About,
    Greeting,
    Imports,
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
      // check for  audio api
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      this.$store.commit('audioApi', (typeof (window.AudioContext) !== 'undefined'))
      // check for clipboard api
      this.$store.commit('clipboardApi', (typeof (navigator.clipboard) !== 'undefined'))
      // check if backup should be made
      const now = Date.now()
      const lastBackupDate = this.$store.getters.getSetting('lastBackupDate') || this.$store.getters.getSetting('dbCreationDate')
      const day = 86400000
      if (now > lastBackupDate + 1 * day) {
        const modalDlg = {
          title: 'Backups',
          text: 'Your last backup is older than 1 day. Please make a backup now.',
          cancelText: 'Not now',
          confirmText: 'Take me to Backups'
        }
        this.$store.commit('showModalDlg', modalDlg)

        EventBus.$on('modalEvent', async (e) => {
          EventBus.$off('modalEvent')
          // mantain dlg open during execution
          if (e === 'confirm') {
            this.$store.commit('showModalComponent', 'backups')
          }
          this.$store.commit('hideModalDlg')
        })
      }
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

  /* main menu with underline like in vuetify.com */
  .v-application.theme--light .v-bar--underline.theme--light {
    border-bottom-color: rgba(0,0,0,.12)!important;
  }

  /* modifications for dark theme */
  .v-application.theme--dark .v-bar--underline.theme--dark {
    border-bottom-color: rgba(255,255,255,.2)!important;
  }

  /* different box shadow for v-dialog-fullscreen with dark theme */
  .v-dialog--fullscreen .v-sheet.theme--dark.v-toolbar:not(.v-sheet--outlined) {
    box-shadow: 0px 2px 4px -1px rgba(255, 255, 255, 0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255, 255, 255, 0.12);
    /* default for dark and light theme
      box-shadow: 0px 2px 4px -1px rgba(255, 255, 255, 0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255, 255, 255, 0.12);
    */
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

  /* create alert background color for dark theme */
  .v-application.theme--dark .v-alert--text:before {
    opacity: 0.3;
  }

  .v-application.theme--dark .v-menu__content {
    box-shadow: 0px 5px 5px -3px rgba(255,255,255, 0.2), 0px 8px 10px 1px rgba(255,255,255, 0.14), 0px 3px 14px 2px rgba(255,255,255, 0.12);
  }

  .v-application.theme--dark .v-data-table .v-data-footer {
    border-top-color: rgba(255,255,255,.2)!important;
  }

  .v-application.theme--dark .v-data-table >  .v-data-table__wrapper > table > thead > tr:last-child > th {
    border-bottom-color: rgba(255,255,255,.2)!important;
  }

  .v-application.theme--dark .v-data-table.v-data-table--fixed-header thead th {
    box-shadow: inset 0 -1px 0 rgba(255,255,255, 0.2);
  }

  .v-application.theme--dark .v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row) {
    border-bottom-color: rgba(255,255,255,.2)!important;
  }

</style>
