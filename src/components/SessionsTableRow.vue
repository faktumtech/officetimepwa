<template>
  <tr
    :key="session.id"
    :class="session.id === selectedSessionId ? 'selected' : ''"
    @click="selectedSessionId = session.id"
    @contextmenu.prevent="(selectedSessionId = session.id) && $emit('row-right-click', session.id, $event)"
    @keydown.esc="selectedSessionId = null"
    tabindex="0"
  >
    <td
      class="tableTimerRow"
    >
      <timer-btn
        v-if="!session.e && (session.id === selectedSessionId || session.id === timerSessionId)"
        :tableTimer="true"
        :timerId="session.id"
      />
      <v-icon
        v-if="session.e"
        size="small"
        icon="$mdiCurrencyUsd"
        title="Expense"
      />
    </td>

    <td
      class="tableDateRow"
    >
      <v-text-field
        v-if="session.id === selectedSessionId"
        class="dateField"
        :model-value="session.d"
        @update:model-value="updateDate(session.id, $event)"
        type="datetime-local"
        required
        density="compact"
        bg-color="transparent"
      />
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
      />
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
      />
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
        :model-value="session.c"
        @update:model-value="updateCategory(session.id, $event)"
        :items="categories"
        item-title="title"
        item-value="id"
        density="compact"
      />
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
        :model-value="session.n"
        @update:model-value="updateNote(session.id, $event)"
        type="text"
        density="compact"
      />
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
  name: 'TimerLog',
  components: {
    TimerBtn,
    TimerTimeInput,
    TimerAmountInput
  },
  data () {
    return {
      Utils
    }
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
    min-width: max(200px, 15vw);
    white-space: nowrap;
  }

  .tableTimeRow {
    min-width: max(80px, 8vw);
    white-space: nowrap;
  }

  table .timeDisplay {
    max-width: 80px;
    white-space: nowrap;
  }
  .tableAmountRow {
    min-width: max(80px, 8vw);
    white-space: nowrap;
  }
  .amountField input {
    text-align: right;
  }
  .tableCategoryRow {
    min-width: max(150px, 15vw);
    white-space: nowrap;
  }

  .tableNotesRow {
    min-width: max(150px, 15vw);
    white-space: nowrap;
    overflow: hidden;
  }

  .sessionsTable .dateField,  .sessionsTable .dateField input{
    max-width: max(200px, 20vw);
    min-width: max(200px, 20vw);
  }

  .sessionsTable .timerField{
    min-width: 80px;
  }

  /* hide hint */

  .sessionsTable .dateField .v-input__details,
  .sessionsTable .timerField .v-input__details,
  .sessionsTable .categoryField .v-input__details,
  .sessionsTable .noteField .v-input__details {
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

  .sessionsTable input{
    padding: 0 !important;
  }

  .sessionsTable .v-field, .sessionsTable .v-field__field input {
    height: 35px !important;
    background-color: transparent !important;
  }
  .sessionsTable .v-field:hover,
  .sessionsTable .v-field:focus,
  .sessionsTable .v-field:focus-within,
  .sessionsTable .v-field--active,
  .sessionsTable .v-field--focused,
  .sessionsTable .v-field--hovered {
    background-color: transparent !important;
  }
  .sessionsTable .v-field__overlay,
  .sessionsTable .v-field__outline {
    opacity: 0 !important;
  }

  .sessionsTable .dateField input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    margin-left: -16px;
    padding: 0;
  }

</style>
