<template>
  <div
    class="timerTimeInput"
  >
    <v-text-field
      v-model="hours"
      class="timerTimeInputHours"
      type="number"
      required
      density="compact"
      @update:model-value="updateTime"
      min="0"
      :disabled="!timerSessionId && !session.id"
    />
    <span class="separator">:</span>
    <v-text-field
      v-model="minutes"
      class="timerTimeInputMinutes"
      type="number"
      required
      density="compact"
      @update:model-value="updateTime"
      min="0"
      :disabled="!timerSessionId && !session.id"
    />
  </div>
</template>

<script>
import Timer from '@/components/Timer'

export default {
  name: 'TimerTimeInput',
  data: () => ({
    // local copies of the fields; kept in sync with session.t by the watcher
    // so that the setters don't read stale values from the session
    hoursInput: 0,
    minutesInput: 0
  }),
  props: {
    session: {
      type: Object,
      default () {
        return {
          id: null,
          t: 0
        }
      }
    }
  },
  computed: {
    timerSessionId () {
      return this.$store.state.timerSessionId
    },
    timerStatus () {
      return this.$store.state.timerStatus
    },
    hours: {
      get () {
        return this.hoursInput
      },
      set (newHours) {
        // ignore an emptied field, '' would be coerced to 0
        if (newHours !== '') {
          this.hoursInput = +newHours
        }
      }
    },
    minutes: {
      get () {
        return this.minutesInput
      },
      set (newMinutes) {
        if (newMinutes !== '') {
          this.minutesInput = +newMinutes
        }
      }
    },
    timerValue () {
      return this.hoursInput * 60 + this.minutesInput
    }
  },
  watch: {
    'session.t': {
      immediate: true,
      handler (t) {
        this.hoursInput = Math.floor(t / 60)
        this.minutesInput = t - Math.floor(t / 60) * 60
      }
    }
  },
  methods: {
    updateTime: async function (val) {
      if (val === '') {
        return
      }
      if (this.timerStatus === 'running' && this.session.id === this.timerSessionId) {
        // absolute update, safe against fast consecutive inputs
        await Timer.setCount(this.timerValue)
      } else {
        // expense > amount is set manually and has nothing to do with rate
        if (this.session.e) {
          const payload = { id: this.session.id, changes: { t: this.timerValue } }
          await this.$store.dispatch('updateSession', payload)
        } else {
          // cast to number
          const amount = Math.round((this.timerValue * this.session.r / 60 + 0.00001) * 100) / 100
          const payload = { id: this.session.id, changes: { t: this.timerValue, a: amount } }
          await this.$store.dispatch('updateSession', payload)
        }
      }
    },
    emitChange: function (_val) {
      // use input event in order to be compatible with use as 'v-model'
      // https://forum.vuejs.org/t/sync-vs-v-model/19380
      // console.log('emitChange', val, this.hours, this.minutes, this.value, this.timerValue)
      this.$emit('input', this.timerValue)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .timerTimeInput {
    display: flex;
    flex: 1 1 auto;
  }
  .timerTimeInputHours, .timerTimeInputMinutes {
    max-width: 50px !important;
  }
  .timerTimeInput input {
    text-align: right;
  }
  .timerTimeInput .separator {
    margin-top: 4px;
  }

</style>
