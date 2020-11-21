<template>
  <v-dialog
    fullscreen
    hide-overlay
    persistent
    no-click-animation
    eager
    :value="show"
    @keydown.esc="show = false"
    class="dlgSticky"
  >
    <v-card>
      <v-toolbar
      >
        <v-btn
          icon
          @click="show = false"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title>Import</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text
        class="dlgScroll"
      >
        <v-container
          fluid
        >
          <v-row
            v-if="loadedItems.length === 0 && parsedItems.length === 0"
          >
            <v-col>
              <v-alert
                :icon="mdiDatabaseImport"
                prominent
                text
                type="info"
              >
                <p>
                  OfficeTimePwa allows you to import sessions and expenses to your projects from a csv file.
                </p>
                <p>
                  The files you import should have csv format with UTF8 encoding, tab or comma as field separator and no headers or footers. You will be asked for confirmation before adding the imported data to your data. Any unkown category will be created automatically.
                </p>
              </v-alert>
            </v-col>
          </v-row>
          <v-row
            v-if="loadedItems.length === 0 && parsedItems.length === 0"
          >
            <v-col
              class="text-right"
            >
              <v-btn
                color="primary"
                text
                @click="$refs.uploader.click()"
              >
                Open csv
              </v-btn>
              <input
                ref="uploader"
                class="d-none"
                type="file"
                accept="*.csv"
                @change="loadData"
              >
            </v-col>
          </v-row>
          <v-row
            v-if="loadedItems.length > 0"
          >
            <v-col
            >
              <v-data-table
                :mobile-breakpoint="0"
                :headers="loadedHeaders"
                :items="loadedItems"
                :items-per-page="10"
                :footer-props="footerProps"
                hide-default-header
                class="elevation-0"
              >
                <template
                  v-slot:top
                >
                  <div
                    class="py-2 text-subtitle-1 warning--text"
                  >
                    Please select the columns to be imported and their target data field!
                  </div>
                </template>
                <template
                  v-slot:header="{ props: { headers } }"
                >
                  <thead>
                    <tr>
                      <th
                        v-for="item in headers" :key="item.value"
                        style="font-weight: normal;"
                      >
                        <v-select
                          v-model="item.parserId"
                          :items="parsers"
                          item-text="text"
                          item-value="id"
                          dense
                        >
                        </v-select>
                      </th>
                    </tr>
                  </thead>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row
            v-if="loadedItems.length > 0"
          >
            <v-col
              class="text-right"
            >
              <v-btn
                text
                @click="cancel()"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="parseData()"
              >
                Parse data
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            v-if="parsedItems.length > 0"
          >
            <v-col
            >
              <v-data-table
                :mobile-breakpoint="0"
                :headers="parsedHeaders"
                :items="parsedItems"
                :items-per-page="10"
                :footer-props="footerProps"
              >
                <template
                  v-slot:top
                >
                  <div
                    class="pa-4 text-subtitle-1 warning--text"
                  >
                    This is the data that will be imported to project <b>{{ activeProject.title }}</b>!
                  </div>
                </template>
                <template
                  v-slot:[`item.d`]="{ item }"
                >
                  {{ Utils.formatDate(item.d) }}
                </template>

              </v-data-table>
            </v-col>
          </v-row>
          <v-row
            v-if="parsedItems.length > 0"
          >
            <v-col
              class="text-right"
            >
              <v-btn
                text
                @click="cancel()"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="importData()"
              >
                Import data
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Papa from 'papaparse'
import Utils from '@/utils/Utils'
// import db from '@/db'
import { mdiClose, mdiDatabaseImport } from '@mdi/js'

export default {
  beforeCreate () {
    this.Utils = Utils
  },
  data: () => ({
    mdiClose: mdiClose,
    mdiDatabaseImport: mdiDatabaseImport,
    loadedHeaders: [],
    loadedItems: [],
    parsedItems: [],
    parsedHeaders: [
      { text: 'Date ', value: 'd' },
      { text: 'Time ', value: 't' },
      { text: 'Rate ', value: 'r' },
      { text: 'Amount ', value: 'a' },
      { text: 'Expense', value: 'e' },
      { text: 'Category ', value: 'c' },
      { text: 'Notes', value: 'n' }
    ],
    footerProps: {
      'items-per-page-options': [10, 25, 100, -1]
    },
    parsers: [
      { id: 0, targetField: null, text: 'Ignore', funct: Utils.parseIgnore },
      { id: 1, targetField: 'd', text: 'Date (dd/MM/yyyy hh:mm)', funct: Utils.parseDateStr },
      { id: 2, targetField: 'd', text: 'Date (yyyy-MM-ddThh:mm)', funct: Utils.parseISODateStr },
      { id: 3, targetField: 't', text: 'Time (min)', funct: Utils.parseMinutes },
      { id: 4, targetField: 't', text: 'Time (hours)', funct: Utils.parseHours },
      { id: 5, targetField: 'a', text: 'Session Amount', funct: Utils.parseNum },
      { id: 6, targetField: 'a', text: 'Expense Amount', funct: Utils.parseNum },
      { id: 7, targetField: 'c', text: 'Category', funct: Utils.parseText },
      { id: 8, targetField: 'n', text: 'Notes', funct: Utils.parseText }
    ],
    expenseIdentifier: 6 // used as identifier of expenses
  }),
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'import'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'import' : false)
      }
    },
    activeProjectId () {
      return this.$store.getters.getSetting('activeProjectId')
    },
    activeProject () {
      return this.$store.getters.getProject(this.activeProjectId)
    }
  },
  watch: {
    show: function () {
      // this could also be done on mounted
      // but then it would not get updated each time the report is opened
      this.loadedItems = []
      this.parsedItems = []
    }
  },
  methods: {
    loadData: function (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      this.$refs.uploader.value = null

      reader.onload = async () => {
        try {
          const result = await Papa.parse(reader.result)
          const loadedItems = result.data
          console.log(loadedItems)
          if (!Array.isArray(loadedItems) || !Array.isArray(loadedItems[0])) {
            this.$store.commit('alert',
              {
                show: true,
                text: 'No data found in this csv file!',
                type: 'error'
              }
            )
          }
          // show table
          const rowsCount = loadedItems.length
          const headersCount = loadedItems[0].length
          const headers = []
          const data = []
          for (let i = 0; i < headersCount; i++) {
            headers.push({ text: 'Col' + i, value: 'col' + i, parserId: 0 })
          }

          for (let i = 0; i < rowsCount; i++) {
            const obj = {}
            for (let j = 0; j < headersCount; j++) {
              obj['col' + j] = loadedItems[i][j]
            }
            data.push(obj)
          }

          this.loadedHeaders = headers
          this.loadedItems = data
        } catch (err) {
          console.error(err)
          this.$store.commit('alert',
            {
              show: true,
              text: 'This file does not seems to be a valid csv file!',
              type: 'error'
            }
          )
        }
      }
    },
    parseData: function () {
      // parsers lookup
      const parsersLookup = []
      for (const parser of this.parsers) {
        parsersLookup[parser.id] = parser
      }

      // lookup of category rates by title
      const categoryRateLookup = []
      for (const item of this.$store.state.categories) {
        categoryRateLookup[item.title] = item.rate
      }

      // check for specified target fields
      let targetFields = this.loadedHeaders.map((obj) => { return parsersLookup[obj.parserId].targetField })
      targetFields = targetFields.filter((el) => { return el !== null })

      // check if parser ('Expense Amount') is included or not
      const isExpense = this.loadedHeaders.find((obj) => { return obj.id === this.expenseIdentifier })

      // target fields should not repeat
      // https://stackoverflow.com/questions/49215358/checking-for-duplicate-strings-in-javascript-array/54974076
      if (new Set(targetFields).size !== targetFields.length) {
        this.$store.commit('alert',
          {
            show: true,
            text: 'Target fields should not repeat!',
            type: 'error',
            timeout: 15000
          }
        )
        return
      }
      // minimum information for expenses
      const minExpenseFields = ['d', 'e']
      const maxExpenseFields = ['d', 't', 'e', 'c', 'n']
      const hasMinExpenseFields = minExpenseFields.every(v => targetFields.includes(v))
      // minimum information for sessions
      const minSessionFields = ['d', 't']
      const maxSessionFields = ['d', 't', 'e', 'c', 'n']
      const hasMinSessionFields = minSessionFields.every(v => targetFields.includes(v))
      const parsedItems = []

      const rows = this.loadedItems.length
      const cols = this.loadedHeaders.length
      const activeProject = this.activeProject
      const activeProjectCategory = this.$store.getters.getCategory(activeProject.defaultCategory)

      if (isExpense && hasMinExpenseFields) {
        for (let i = 0; i < 1; i++) {
          const obj = {
            p: activeProject.id,
            e: true, // expense
            d: null,
            t: 0, // time
            a: 0, // amount
            c: activeProjectCategory.title,
            r: 0,
            n: ''
          }
          for (let j = 0; j < cols; j++) {
            const parserId = this.loadedHeaders[j].parserId
            const parser = parsersLookup[parserId]
            // ignore parser without targetField or a not suitable targetField
            if (parser.targetField !== null || maxExpenseFields.includes(parser.targetField)) {
              obj[parser.targetField] = parser.funct(this.loadedItems[i]['col' + j])
              console.log(i, j, this.loadedItems[i]['col' + j])
            }
          }
          parsedItems.push(obj)
        }
      } else if (!isExpense && hasMinSessionFields) {
        console.log(this.loadedItems)

        for (let i = 0; i < rows; i++) {
          const obj = {
            p: activeProject.id,
            e: false, // session
            d: null,
            t: 0, // time
            a: 0, // amount
            c: activeProjectCategory.title,
            r: 0,
            n: ''
          }
          for (let j = 0; j < cols; j++) {
            const parserId = this.loadedHeaders[j].parserId
            const parser = parsersLookup[parserId]
            // ignore parser without targetField or a not suitable targetField
            if (parser.targetField !== null || maxSessionFields.includes(parser.targetField)) {
              obj[parser.targetField] = parser.funct(this.loadedItems[i]['col' + j])
            }
          }
          // if category given, lookup real rate
          let rate = activeProjectCategory.rate
          if (targetFields.includes('c')) {
            const category = categoryRateLookup[obj.c]
            if (category) {
              rate = category.rate
            }
          }
          obj.r = rate

          // if amount not given, calculate from category rate and time
          if (!targetFields.includes('a')) {
            obj.a = Utils.round(rate * obj.t / 60, 2)
          // if amount given, try to calculate rate from amount and time
          } else if (obj.a !== 0 && obj.t !== 0) {
            obj.r = Utils.round(60 * obj.a / obj.t, 2)
          }
          parsedItems.push(obj)
        }
      } else {
        this.$store.commit('alert',
          {
            show: true,
            text: 'Missing columns. Please make sure you selected columns to be imported. To import expenses you need at least \'Expense Amount\' and \'DateTime\'. To import sessions you need al least \'DateTime\' and \'Time\'!',
            type: 'error',
            timeout: 15000
          }
        )
        return
      }
      console.log(parsedItems)
      this.parsedItems = parsedItems
      this.loadedItems = []
    },
    importData: async function () {
      try {
        // lookup of category ids by title
        const categoryIdLookup = {}
        for (const item of this.$store.state.categories) {
          categoryIdLookup[item.title] = item.id
        }
        // copy to other array in order to avoid vue reactivity and display updates
        const importItems = []
        for (const item of this.parsedItems) {
          const importItem = { ...item }

          // replace category title with ids
          let categoryId = categoryIdLookup[item.c]
          if (!categoryId) {
            categoryId = await this.$store.dispatch('createCategory', { title: item.c, rate: 0 })
            // add also to our lookup
            categoryIdLookup[item.c] = categoryId
          }
          importItem.c = categoryId
          // replace date with ISO dateTime string without seconds
          importItem.d = Utils.formatDateToLocalDateTimeIsoStr(importItem.d).slice(0, -3)
          importItems.push(importItem)
        }
        this.$store.dispatch('importSessions', importItems)

        this.$store.commit('alert',
          {
            show: true,
            text: 'Data imported correctly to project ' + this.activeProject.title + '.',
            type: 'info'
          }
        )
      } catch (err) {
        this.backup = null
        console.error(err)
        this.$store.commit('alert',
          {
            show: true,
            text: 'Unkown error during import!',
            type: 'error',
            timeout: 15000
          }
        )
      }
    },
    cancel: function () {
      this.loadedHeaders = []
      this.loadedItems = []
      this.parsedItems = []
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
