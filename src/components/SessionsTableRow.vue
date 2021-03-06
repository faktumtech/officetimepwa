<template>
  <tr
    :key="session.id"
    :class="session.id === selectedSessionId ? 'selected' : ''"
    @click="selectedSessionId = session.id"
    @click.right.prevent="(selectedSessionId = session.id) && $emit('row-right-click', session.id, $event)"
    @keydown.esc="selectedSessionId = null"
    tabindex="0"
  >
    <td
      class="tableTimerRow"
    >
      <timer-btn
        v-if="session.id === selectedSessionId || session.id === timerSessionId"
        :tableTimer="true"
        :timerId="session.id"
      >
      </timer-btn>
    </td>

    <td
      class="tableDateRow"
    >
      <v-text-field
        v-if="session.id === selectedSessionId"
        class="dateField"
        :value="session.d"
        @change="updateDate(session.id, $event)"
        type="datetime-local"
        required
        dense
      ></v-text-field>
      <span
        v-else
        class="dateDisplay"
      >
        {{ Utils.formatDate(session.d) }}
      </span>
    </td>
    <td
      class="tableTimeRow text-end"
    >
      <TimerTimeInput
         v-if="session.id === selectedSessionId"
        class="timerField"
        :session="session"
      ></TimerTimeInput>
      <span
        v-else
        class="timeDisplay text-end"
      >
        {{ Utils.formatTime(session.t) }}
      </span>
    </td>
    <td
      class="tableAmountRow text-end"
    >
      <TimerAmountInput
         v-if="session.id === selectedSessionId"
        :session="session"
      ></TimerAmountInput>
      <span
        v-else
      >
        {{ Utils.formatAmount(session.a, 2) }}
      </span>
    </td>
    <td
      class="tableCategoryRow"
    >
      <v-select
         v-if="session.id === selectedSessionId"
        class="categoryField"
        :value="session.c"
        @change="updateCategory(session.id, $event)"
        :items="categories"
        item-text="title"
        item-value="id"
        dense
      ></v-select>
      <span
        v-else
      >
        {{ categoryTitleLookup[session.c] }}
      </span>
    </td>
    <td
      class="tableNotesRow"
    >
      <v-text-field
        v-if="session.id === selectedSessionId"
        class="noteField"
        :value="session.n"
        @change="updateNote(session.id, $event)"
        type="text"
        dense
      ></v-text-field>
      <span
        v-else
      >
        {{ session.n }}
      </span>
    </td>
  </tr>
</template>

<script>
import Utils from '@/utils/Utils'
import TimerBtn from '@/components/TimerBtn'
import TimerTimeInput from '@/components/TimerTimeInput'
import TimerAmountInput from '@/components/TimerAmountInput'

export default {
  beforeCreate () {
    this.Utils = Utils
  },
  name: 'TimerLog',
  components: {
    TimerBtn,
    TimerTimeInput,
    TimerAmountInput
  },
  props: {
    // row timerId when used in timerLog table
    session: Object
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
    selectedSessionId: {
      set (value) {
        this.$store.commit('selectedSessionId', value)
      },
      get () {
        return this.$store.state.selectedSessionId
      }
    },
    categories () {
      return this.$store.state.categories
    },
    categoryTitleLookup () {
      return this.$store.getters.categoryTitleLookup()
    }
  },
  methods: {
    updateDate: async function (timerId, value) {
      const payload = { id: timerId, changes: { d: value } }
      await this.$store.dispatch('updateSession', payload)
    },
    updateTime: async function (timerId, value) {
      if (this.timerStatus === 'running' && timerId === this.timerSessionId) {
        console.log('updateTime on running timer', value, this.session.t)
        this.timerOffset = this.timerOffset + value - this.session.t
      } else {
        const payload = { id: timerId, changes: { t: value } }
        await this.$store.dispatch('updateSession', payload)
      }
    },
    updateCategory: async function (timerId, value) {
      const payload = { id: timerId, changes: { c: value } }
      await this.$store.dispatch('updateSession', payload)
    },
    updateAmount: async function (timerId, value) {
      const payload = { id: timerId, changes: { a: value } }
      await this.$store.dispatch('updateSession', payload)
    },
    updateNote: async function (timerId, value) {
      const payload = { id: timerId, changes: { n: value } }
      await this.$store.dispatch('updateSession', payload)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .v-data-table.timerLog tr > th,
  .v-data-table.timerLog tr > td {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .tableTimer {
    height: 30px !important;
    width: 30px !important;
  }

  .tableTimerRow {
    width: 46px !important; /* 30 + 2 x 8 */
  }

  .tableDateRow {
    white-space: nowrap;
  }

  .tableTimeRow {
    width: max(150px, 15vw);
    white-space: nowrap;
  }

  table .timeDisplay {
    white-space: nowrap;
    max-width: 100px;
  }
  .tableAmountRow {
    width: max(150px, 15vw);
    white-space: nowrap;
  }
  .amountField input {
    text-align: right;
  }
  .tableCategoryRow {
    width: max(150px, 15vw);
    white-space: nowrap;
  }

  .tableNotesRow {
    white-space: nowrap;
    overflow: hidden;
  }

  .sessionsTable .dateField,  .sessionsTable .dateField input{
    max-width: max(200px, 20vw);
  }

  .sessionsTable .timerField{
    min-width: 80px;
  }

  /* hide hint */
  .sessionsTable .dateField .v-text-field__details,
  .sessionsTable .timerField .v-text-field__details,
  .sessionsTable .categoryField .v-text-field__details,
  .sessionsTable .noteField .v-text-field__details {
    display: none;
  }

  .sessionsTable .dateField,
  .sessionsTable .timerField,
  .sessionsTable .categoryField,
  .sessionsTable .noteField {
    margin-bottom: 4px;
  }

  .sessionsTable .timeDisplay {
    white-space: nowrap;
  }

  .sessionsTable .dateField {
    margin-top: 1px !important;
  }

  .sessionsTable .timerField {
    display: inline-flex;
  }

</style>
