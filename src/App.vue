<template>
  <v-app>
    <AppBar></AppBar>
    <v-main>
      <SessionsTable
        v-if="activeProjectId"
      ></SessionsTable>
      <AboutText
        v-else
      ></AboutText>
      <!--
        use v-if or eager on v-dialog until focus bug is solved
        https://github.com/vuetifyjs/vuetify/issues/11257
       -->
      <Projects></Projects>
      <Categories></Categories>
      <Reports></Reports>
      <Settings></Settings>
      <Backup></Backup>
      <About></About>
    </v-main>
    <ModalDlg></ModalDlg>
    <Alert></Alert>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar'
import ModalDlg from '@/components/ModalDlg'
import Alert from '@/components/Alert'
import SessionsTable from '@/components/SessionsTable'
import Projects from '@/components/Projects'
import Categories from '@/components/Categories'
import Settings from '@/components/Settings'
import Backup from '@/components/Backup'
import About from '@/components/About'
import AboutText from '@/components/AboutText'
import Reports from '@/components/Reports'

export default {
  name: 'App',

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
    AboutText
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
</style>
