<template>
  <v-fab-transition>
    <v-btn
      v-if="tableTimer || btnStatus!=='running'"
      @click.left.stop="timerClick"
      @click.right.prevent.stop="timerClickRight"
      :title="btn[btnStatus].title"
      :color="btn[btnStatus].color"
      elevation="1"
      fab
      small
      left
      :class="tableTimer ? 'tablebtn' : ''"
    >
      <v-icon
      >{{ btn[btnStatus].icon }}</v-icon>
    </v-btn>

    <v-progress-circular
      v-else
      :size="48"
      :width="2"
      indeterminate
      :color="btn[btnStatus].color"
    >
      <v-btn
        @click.left.stop="timerClick"
        @click.right.prevent="timerClickRight"
        v-on:keyup.space="timerClick"
        @keyup.native.alt.67="timerClick"
        :title="btn[btnStatus].title"
        :color="btn[btnStatus].color"
        elevation="1"
        fab
        small
        left
      >
        <v-icon
        >{{ btn[btnStatus].icon }}</v-icon>
      </v-btn>
    </v-progress-circular>
  </v-fab-transition>
</template>

<script>
import Timer from '@/components/Timer'
import { mdiPlay, mdiPlayPause, mdiStop } from '@mdi/js'

export default {
  name: 'TimerBtn',

  data () {
    return {
      timerSecondsSum: 0,
      timerSecondsActual: 0,
      btn: {
        stopped: {
          color: 'primary',
          icon: mdiPlay,
          title: 'Start session\n(Keyboard: space)'
        },
        paused: {
          color: 'error',
          icon: mdiPlayPause,
          title: 'Resume session\n(Keyboard: space)\n\nStop (Right clic)\n(Keyboard: ctrl+space)'
        },
        running: {
          color: 'success',
          icon: mdiStop,
          title: 'Stop\n(Keyboard: ctrl+space)\n\nPause (Right clic)\n(Keyboard: space)'
        }
      }
    }
  },
  props: {
    // tableTimer use as timer in timerLog table
    tableTimer: {
      type: Boolean,
      default: false
    },
    // row timerId when used in timerLog table
    timerId: {
      type: Number,
      default: null
    }
  },
  created () {
    // component will be loaded twice => only add listener for component in appbar
    if (!this.tableTimer) {
      window.addEventListener(
        'keyup',
        this.listenForKeyboardShortcuts
      )
    }
  },
  destroyed () {
    if (!this.tableTimer) {
      window.removeEventListener(
        'keyup',
        this.listenForKeyboardShortcuts
      )
    }
  },
  computed: {
    activeProjectId () {
      return this.$store.getters.getSetting('activeProjectId')
    },
    timerSessionId () {
      return this.$store.state.timerSessionId
    },
    timerStatus () {
      return this.$store.state.timerStatus
    },
    btnStatus () {
      if (this.timerStatus === 'stopped' || (this.tableTimer && this.timerId !== this.timerSessionId)) {
        return 'stopped'
      } else if (this.timerStatus === 'paused') {
        return 'paused'
      } else {
        return 'running'
      }
    }
  },

  methods: {
    listenForKeyboardShortcuts (event) {
      console.log(event)
      const tagName = (event && event.target) ? event.target.tagName : false
      const ignoredTags = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON']
      // space key => avoid triggering in forms
      if (event.keyCode === 32 && !ignoredTags.includes(tagName)) {
        console.log('space key')
        if (this.btnStatus === 'running') {
          if (event.ctrlKey) {
            Timer.stop()
          } else {
            Timer.pause()
          }
        } else if (this.btnStatus === 'paused') {
          if (event.ctrlKey) {
            Timer.stop()
          } else {
            this.timerStart()
          }
        } else {
          this.timerStart()
        }
      }
    },
    timerClickRight: function () {
      console.log('right click')
      if (this.btnStatus === 'running') {
        Timer.pause()
      } else if (this.btnStatus === 'paused') {
        Timer.stop()
      }
    },
    timerClick: async function () {
      console.log('left click')
      if (this.btnStatus === 'running') {
        Timer.stop()
      } else {
        this.timerStart()
      }
    },
    /**
     * resume or create new session according to btnStatus
    */
    timerStart: async function () {
      if (this.btnStatus === 'running') {
        return
      }
      // stopped or paused
      let timerId = this.timerId
      if (timerId === null) {
        // mainbtn
        if (this.btnStatus === 'stopped') {
          timerId = await this.$store.dispatch('createSession', this.activeProjectId)
        } else if (this.btnStatus === 'paused') {
          // timerSessionId should still be set
          timerId = this.$store.state.timerSessionId
        }
      }
      const session = this.$store.getters.getSession(timerId)
      // don't select automatically but unselect any
      this.$store.commit('selectedSessionId', session.id)
      Timer.start(session.id, session.t, session.r)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .v-btn--fab.tablebtn {
      height: 28px !important;
      width: 28px !important;
  }
  .v-btn--icon.tablebtn .v-icon, .v-btn--fab.tablebtn .v-icon {
      height: 17px !important;
      font-size: 17px !important;
      width: 17px !important;
  }
</style>
