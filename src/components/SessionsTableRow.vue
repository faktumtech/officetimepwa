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

    <td v-if="session.id === selectedSessionId"
      class="tableDateRow"
    >
      <v-text-field
        class="dateField"
        :value="session.d"
        @change="updateDate(session.id, $event)"
        type="datetime-local"
        required
        dense
      ></v-text-field>
    </td>
    <td v-else
      class="tableDateRow"
    >
      <div class="dateDisplay">
        {{ formatDate(session.d) }}
      </div>
    </td>
    <td v-if="session.id === selectedSessionId"
      class="tableTimeRow"
    >
      <TimerTimeInput
        class="timerField"
        :session="session"
      ></TimerTimeInput>
    </td>
    <td
      class="tableTimeRow"
      v-else
    >
      <div class="timeDisplay text-end">
        {{ formatTime(session.t) }}
      </div>
    </td>
    <td v-if="session.id === selectedSessionId"
      class="tableCategoryRow"
    >
      <v-select
        class="categoryField"
        :value="session.c"
        @change="updateCategory(session.id, $event)"
        :items="categories"
        item-text="title"
        item-value="id"
        dense
      ></v-select>
    </td>
    <td v-else
      class="tableCategoryRow"
    >{{ categoryLookup[session.c] }}</td>
    <td v-if="session.id === selectedSessionId"
      class="tableNotesRow"
    >
      <v-text-field
        class="noteField"
        :value="session.n"
        @change="updateNote(session.id, $event)"
        type="text"
        dense
      ></v-text-field>
    </td>
    <td v-else
      class="tableNotesRow"
    >{{ session.n }}</td>
  </tr>
</template>

<script>
import TimerBtn from '@/components/TimerBtn'
import TimerTimeInput from './TimerTimeInput'

export default {
  name: 'TimerLog',
  components: {
    TimerBtn,
    TimerTimeInput
  },
  data: () => ({
    headers: [
      { text: '', value: false },
      { text: 'Date', value: 'd' },
      { text: 'Time', value: 't' },
      { text: 'Category', value: 'c' },
      { text: 'Notes', value: 'n' }
    ],
    search: null
  }),
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
    categoryLookup () {
      return this.$store.getters.categoryLookup()
    }
  },
  methods: {
    formatTime: function (time) {
      const hours = Math.floor(time / 60)
      const minutes = time - hours * 60
      return '' + hours + ' : ' + ('0' + minutes).slice(-2)
    },
    formatDate: function (date) {
      // (item.d).slice(0, -3)
      return new Date(date).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
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
    width: max(200px, 20vw);
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
  .tableCategoryRow {
    width: max(150px, 15vw);
    white-space: nowrap;
  }

  .tableNotesRow {
    white-space: nowrap;
    overflow: hidden;
  }

  .sessionsTable .dateField,  .sessionsTable .dateField input{
    width: max(200px, 30vw);
    max-width: 300px;
  }

  /* hide hint */
  .sessionsTable .dateField .v-text-field__details,
  .sessionsTable .timerField .v-text-field__details,
  .sessionsTable .categoryField .v-text-field__details,
  .sessionsTable .noteField .v-text-field__details {
    display: none;
  }

  .sessionsTable .dateField, .sessionsTable .timerField,
  .sessionsTable .categoryField, .sessionsTable .noteField {
    margin-bottom: 4px;
  }

  .sessionsTable .timeDisplay {
    white-space: nowrap;
  }

  .sessionsTable .dateField {
    margin-top: 1px !important;
  }

</style>
