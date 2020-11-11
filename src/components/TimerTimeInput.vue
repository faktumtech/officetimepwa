<template>
  <div
    class="timerTimeInput"
  >
    <v-text-field
      v-model="hours"
      class="timerTimeInputHours"
      type="number"
      required
      dense
      @input="updateTime"
      min="0"
      :disabled="!timerSessionId && !session.id"
    ></v-text-field>
    <span class="separator">:</span>
    <v-text-field
      v-model="minutes"
      class="timerTimeInputMinutes"
      type="number"
      required
      dense
      @input="updateTime"
      min="0"
      :disabled="!timerSessionId && !session.id"
    ></v-text-field>
  </div>
</template>

<script>

export default {
  name: 'TimerTimeInput',
  data: () => ({
    timerValue: 0
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
    timerOffset: {
      set (value) {
        this.$store.commit('timerOffset', value)
      },
      get () {
        return this.$store.state.timerOffset
      }
    },
    hours: {
      get () {
        return Math.floor(this.session.t / 60)
      },
      set (newHours) {
        this.timerValue = this.minutes + 60 * +newHours
      }
    },
    minutes: {
      get () {
        return this.session.t - Math.floor(this.session.t / 60) * 60
      },
      set (newMinutes) {
        this.timerValue = this.hours * 60 + +newMinutes
      }
    }
  },
  mounted: function () {
    this.timerValue = this.session.t
  },
  methods: {
    updateTime: async function () {
      if (this.timerStatus === 'running' && this.session.id === this.timerSessionId) {
        console.log('updateTime on running timer', this.timerValue, this.session.t)
        this.timerOffset = this.timerOffset + this.timerValue - this.session.t
      } else {
        const payload = { id: this.session.id, changes: { t: this.timerValue } }
        await this.$store.dispatch('updateSession', payload)
      }
    },
    emitChange: function (val) {
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
