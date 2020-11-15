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
        <v-toolbar-title>Reports</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            text
            @click="exportReport"
            :disabled="!rawSessions || rawSessions.length === 0"
          >
            Copy to clipboard
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text
        class="dlgScroll"
      >
        <v-container
          fluid
          mt-2
        >
          <v-row
            dense
          >
            <v-col
              cols="12"
              sm="6"
              lg="6"
            >
              <v-row
                dense
              >
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-select
                    v-model="dateRange"
                    :items="datePresets"
                    item-text="title"
                    item-value="id"
                    label="Dates"
                    dense
                  >
                  </v-select>
                </v-col>
                <v-col
                  cols="6"
                  lg="3"
                >
                  <v-text-field
                    class="dateField"
                    v-model="startDate"
                    type="date"
                    required
                    dense
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="6"
                  lg="3"
                >
                  <v-text-field
                    class="dateField"
                    v-model="endDate"
                    type="date"
                    required
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              lg="5"
              offset-lg="1"
            >
              <v-row
                dense
              >
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-select
                    v-model="selectedProjects"
                    :items="projects"
                    item-text="title"
                    item-value="id"
                    label="Projects"
                    multiple
                    dense
                  >
                    <template v-slot:selection="{ item, index }">
                      <span v-if="selectedProjects.length !== projects.length">
                        <span v-if="index < selectedProjects.length-1">{{ item.title }},&nbsp;</span>
                        <span v-else>{{ item.title }}</span>
                      </span>
                      <span v-else-if="index === 0">
                        All Projects
                      </span>
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item
                        ripple
                        @click="toggleProjectSelect"
                      >
                        <v-list-item-action>
                          <v-icon>
                            {{ iconProjectSelect }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            Select All
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-select
                    v-model="selectedCategories"
                    :items="categories"
                    item-text="title"
                    item-value="id"
                    label="Categories"
                    multiple
                    dense
                  >
                    <template v-slot:selection="{ item, index }">
                      <span v-if="selectedCategories.length !== categories.length">
                        <span v-if="index < selectedCategories.length-1">{{ item }}, </span>
                        <span v-else>{{ item.title }}</span>
                      </span>
                      <span v-else-if="index === 0">
                        All Categories
                      </span>
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item
                        ripple
                        @click="toggleCategorySelect"
                      >
                        <v-list-item-action>
                          <v-icon>
                            {{ iconCategorySelect }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            Select All
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>
                </v-col>

              </v-row>
            </v-col>
          </v-row>

          <v-row
            dense
          >
            <v-col
              cols="6"
            >
              <v-row
                no-gutters
              >
                <v-col
                  cols="12"
                >
                  <p
                    class="subtitle-2 mb-0"
                  >
                    Show
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-checkbox
                    v-model="showExpenses"
                    label="Expenses"
                    hide-details
                    dense
                  ></v-checkbox>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-checkbox
                    v-model="showSessions"
                    label="Sessions"
                    hide-details
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="6"
              lg="5"
              offset-lg="1"
            >
              <v-row
                no-gutters
              >
                <v-col
                  cols="12"
                >
                  <p
                    class="subtitle-2 mb-0"
                  >
                    Group by
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-checkbox
                    v-model="groupByProject"
                    label="Project"
                    hide-details
                    dense
                  ></v-checkbox>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-checkbox
                    v-model="groupByCategory"
                    label="Category"
                    hide-details
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-data-table
            :mobile-breakpoint="0"
            :headers="headers"
            :items="groupedSessions"
            :items-per-page="100"
            :sort-by="'id'"
            :sort-desc="true"
            :loading="loading"
            disable-sort
            class="sessionsTable mt-4"
            dense
            fixed-header
            height="calc(100vh - 140px)"
          >
            <template
              v-slot:body="{ items }"
            >
              <tbody
                v-if="!items || items.length === 0"
              >
                <tr
                  class="noData"
                >
                  <td
                    colspan="5"
                    class="ps-0"
                  >
                    <p
                      v-if=loading
                      class="text-center pa-4"
                    >
                      Loading...
                    </p>
                    <v-alert
                      v-else
                      :icon="mdiDatabaseOff"
                      prominent
                      text
                      type="info"
                    >
                      No data with this selection. Please try other selection.
                    </v-alert>
                  </td>
                </tr>
              </tbody>

              <tbody
                v-else
              >
                <tr
                  v-for="item in items"
                  :key="item.id"
                >
                  <td v-if="item.type === 'session' || item.type === 'expense'">
                    {{ item.p }}
                  </td>
                  <td v-else colspan="2">
                      <b>{{ item.p }}</b>
                  </td>
                  <td v-if="item.type === 'session' || item.type === 'expense'">
                    {{ formatDate(item.d) }}
                  </td>
                  <td
                  >
                    <div class="timeDisplay">
                      <span v-if="item.type === 'session' || item.type === 'expense'">
                        {{ formatTime(item.t) }}
                      </span>
                      <span v-else>
                        <b>{{ formatTime(item.t) }}</b>
                      </span>
                    </div>
                  </td>
                  <td
                  >
                    <div class="amountDisplay">
                      <span v-if="item.type === 'session' || item.type === 'expense'">
                        {{ formatAmount(item.a) }}
                      </span>
                      <span v-else>
                        <b>{{ formatAmount(item.a) }}</b>
                      </span>
                    </div>
                  </td>
                  <td
                    class="tableCategoryRow"
                  >
                    {{ categoryLookup[item.c] }}
                  </td>
                  <td
                    class="tableNotesRow"
                  >
                    {{ item.n }}
                  </td>
                </tr>
              </tbody>
            </template>

          </v-data-table>

        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '@/db'
import { mdiClose, mdiDatabaseOff, mdiCloseBox, mdiMinusBox, mdiCheckboxBlankOutline } from '@mdi/js'

export default {
  data () {
    return {
      mdiClose: mdiClose,
      mdiDatabaseOff: mdiDatabaseOff,
      headers: [
        { text: 'Project', value: 'p' },
        { text: 'Date', value: 'd' },
        { text: 'Time', value: 't' },
        { text: 'Amount', value: 'a' },
        { text: 'Category', value: 'c' },
        { text: 'Notes', value: 'n' }
      ],
      loading: false,
      rawSessions: [],
      groupedSessions: [],
      datePresets: [],
      dateRange: null,
      startDate: null,
      endDate: null,
      selectedProjects: [],
      selectedCategories: [],
      showExpenses: false,
      showSessions: false,
      groupByProject: false,
      groupByCategory: false
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'reports'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'reports' : false)
      }
    },
    allProjectsSelected () {
      return this.selectedProjects.length === this.projects.length
    },
    someProjectsSelected () {
      return this.selectedProjects.length > 0 && !this.allProjectsSelected
    },
    iconProjectSelect () {
      if (this.allProjectsSelected) return mdiCloseBox
      if (this.someProjectsSelected) return mdiMinusBox
      return mdiCheckboxBlankOutline
    },
    allCategoriesSelected () {
      return this.selectedCategories.length === this.categories.length
    },
    someCategoriesSelected () {
      return this.selectedCategories.length > 0 && !this.allCategoriesSelected
    },
    iconCategorySelect () {
      if (this.allCategoriesSelected) return mdiCloseBox
      if (this.someCategoriesSelected) return mdiMinusBox
      return mdiCheckboxBlankOutline
    },
    isDirty () {
      return true
    },
    projects () {
      return this.$store.state.projects
    },
    categories () {
      return this.$store.state.categories
    },
    categoryLookup () {
      return this.$store.getters.categoryLookup()
    },
    sessionsQueryParams () {
      return {
        startDate: this.startDate,
        endDate: this.endDate,
        selectedProjects: this.selectedProjects,
        selectedCategories: this.selectedCategories
      }
    },
    sessionsShowGroup () {
      return {
        showExpenses: this.showExpenses,
        showSessions: this.showSessions,
        groupByProject: this.groupByProject,
        groupByCategory: this.groupByCategory
      }
    }

  },
  watch: {
    sessionsQueryParams: function (params) {
      this.getSessionsByQuery(params)
    },
    sessionsShowGroup (params) {
      this.formatSessions(params)
    },
    show: function () {
      // this could also be done on mounted
      // but then it would not get updated each time the report is opened
      this.datePresets = this.getDatePresets()
      this.dateRange = 1
      // preselect all categories
      this.selectedCategories = this.categories.map((obj) => { return obj.id })
      this.selectedProjects = []
    },
    dateRange: function (id) {
      const datePreset = this.datePresets.find(item => item.id === id)
      if (datePreset) {
        this.startDate = datePreset.startDate
        this.endDate = datePreset.endDate
      }
    }
  },
  methods: {
    getLocalDateStr: function (date) {
      // local date string in format "yyyy-MM-dd"
      // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
      const tzoffset = (date).getTimezoneOffset() * 60000 // offset in milliseconds
      return (new Date(date - tzoffset)).toISOString().slice(0, -14)
    },

    getDatePresets: function () {
      const today = new Date()
      console.log(this.getLocalDateStr(today))
      const longAgo = new Date(2000, 0, 1) // month jan = 0
      const weekStart = new Date(new Date().setDate(today.getDate() - today.getDay()))
      const yearStart = new Date(today.getFullYear(), 0, 1) // month jan = 0
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      console.log(this.getLocalDateStr(today), this.getLocalDateStr(monthStart), this.getLocalDateStr(yearStart))
      return [
        {
          id: 1,
          title: 'All times',
          startDate: this.getLocalDateStr(longAgo),
          endDate: this.getLocalDateStr(today)
        },
        {
          id: 2,
          title: 'Today',
          startDate: this.getLocalDateStr(today),
          endDate: this.getLocalDateStr(today)
        },
        {
          id: 3,
          title: 'This week',
          startDate: this.getLocalDateStr(weekStart),
          endDate: this.getLocalDateStr(today)
        },
        {
          id: 4,
          title: 'This month',
          startDate: this.getLocalDateStr(monthStart),
          endDate: this.getLocalDateStr(today)
        },
        {
          id: 5,
          title: 'This year',
          startDate: this.getLocalDateStr(yearStart),
          endDate: this.getLocalDateStr(today)
        }
      ]
    },
    getSessionsByQuery: async function (params) {
      this.loading = true
      this.groupedSessions = []
      this.rawSessions = await db.getSessionsByQuery(params)
      console.log('getSessionsByQuery', this.rawSessions.length)
      this.formatSessions()
    },
    /**
     * sort and group rawSessions
     * and format ready to show in table
     * @return undefined
    */
    formatSessions: function () {
      this.loading = true
      this.groupedSessions = []
      const input = this.rawSessions
      const output = []

      if (input && input.length > 0) {
        // make projects lookup
        var projects = []
        for (const project of this.projects) {
          projects[project.id] = project.title
        }
        console.log('projects', projects)

        // sort
        input.sort((a, b) => {
          // order by p (project), c (category), d (date)
          if (this.groupByProject && this.groupByCategory) {
            // sort by project title rather than project
            const ap = projects[a.p] || ''
            const bp = projects[b.p] || ''

            // check first level
            if (ap < bp) {
              return -1
            } else if (ap > bp) {
              return 1
            } else {
              // check second level
              if (a.c < b.c) {
                return -1
              } else if (a.c > b.c) {
                return 1
              } else {
                // check third level
                if (a.d < b.d) {
                  return -1
                } else if (a.d > b.d) {
                  return 1
                } else {
                  return 0
                }
              }
            }

          // order by p (project), d (date)
          } else if (this.groupByProject) {
            // sort by project title rather than project
            const ap = projects[a.p] || ''
            const bp = projects[b.p] || ''

            // check first level
            if (ap < bp) {
              return -1
            } else if (ap > bp) {
              return 1
            } else {
              // check second level
              if (a.d < b.d) {
                return -1
              } else if (a.d > b.d) {
                return 1
              } else {
                return 0
              }
            }

          // order by c (category), d (date)
          } else if (this.groupByCategory) {
            // check first level
            if (a.c < b.c) {
              return -1
            } else if (a.c > b.c) {
              return 1
            } else {
              // check second level
              if (a.d < b.d) {
                return -1
              } else if (a.d > b.d) {
                return 1
              } else {
                return 0
              }
            }

          // order by d (date)
          } else {
            if (a.d < b.d) {
              return -1
            } else if (a.d > b.d) {
              return 1
            } else {
              return 0
            }
          }
        })

        let actProject = input[0].p
        let actCategory = input[0].c
        let actTotalTime = 0
        let actProjectTime = 0
        let actCategoryTime = 0
        let actTotalAmount = 0
        let actProjectAmount = 0
        let actCategoryAmount = 0

        for (const row of input) {
          // make category subtotal if change of category or project
          if (
            (this.groupByCategory && actCategory !== row.c) ||
            (this.groupByProject && this.groupByCategory && actProject !== row.p)
          ) {
            output.push({
              p: 'Sum category "' + actCategory + '"',
              d: '',
              t: actCategoryTime,
              a: actCategoryAmount,
              c: '',
              n: '',
              type: 'subtotal'
            })
            actCategoryTime = 0
            actCategory = row.c
          }
          // make project subtotal if change of project
          if (this.groupByProject && actProject !== row.p) {
            output.push({
              p: 'Sum project "' + projects[actProject] + '"',
              d: '',
              t: actProjectTime,
              a: actProjectAmount,
              c: '',
              n: '',
              type: 'subtotal'
            })
            actProjectTime = 0
            actProject = row.p
          }
          if (this.showSessions && !row.e) {
            output.push({
              p: projects[row.p] || '',
              d: row.d,
              t: row.t,
              a: row.a,
              c: row.c,
              n: row.n,
              type: 'session'
            })
          }
          if (this.showExpenses && row.e) {
            output.push({
              p: projects[row.p] || '',
              d: row.d,
              t: row.t,
              a: row.a,
              c: row.c,
              n: row.n,
              type: 'expense'
            })
          }
          if (
            // don't sum expenses
            (this.showSessions && !this.showExpenses && !row.e) ||
            // don't sum sessions
            (!this.showSessions && this.showExpenses && row.e) ||
            (!this.showSessions && !this.showExpenses) ||
            (this.showSessions && this.showExpenses)
          ) {
            actTotalTime += row.t
            actProjectTime += row.t
            actCategoryTime += row.t
            actTotalAmount += row.a
            actProjectAmount += row.a
            actCategoryAmount += row.a
          }
        }
        // final category subtotal
        if (this.groupByCategory) {
          output.push({
            p: 'Sum category "' + actCategory + '"',
            d: '',
            t: actCategoryTime,
            a: actCategoryAmount,
            c: '',
            n: '',
            type: 'subtotal'
          })
        }
        // final project subtotal
        if (this.groupByProject) {
          output.push({
            p: 'Sum project "' + projects[actProject] + '"',
            d: '',
            t: actProjectTime,
            a: actProjectAmount,
            c: '',
            n: '',
            type: 'subtotal'
          })
        }

        // final total
        output.push({
          p: 'TOTAL SUM',
          d: '',
          t: actTotalTime,
          a: actTotalAmount,
          c: '',
          n: '',
          type: 'total'
        })
      }

      this.groupedSessions = output
      this.loading = false
      console.log('formatSessions', this.groupedSessions.length)
    },

    formatTime: function (time, nospace) {
      const hours = Math.floor(time / 60)
      const minutes = time - hours * 60
      const space = (nospace) ? '' : ' '
      return '' + hours + space + ':' + space + ('0' + minutes).slice(-2)
    },
    formatDate: function (date) {
      // (item.d).slice(0, -3)
      return new Date(date).toLocaleString()
    },
    formatAmount: function (amount) {
      return Math.round((amount + 0.00001) * 100) / 100
    },
    toggleProjectSelect () {
      this.$nextTick(() => {
        if (this.allProjectsSelected) {
          this.selectedProjects = []
        } else {
          // projects: array of objs
          this.selectedProjects = this.projects.map((obj) => { return obj.id })
        }
      })
    },
    toggleCategorySelect () {
      this.$nextTick(() => {
        if (this.allCategoriesSelected) {
          this.selectedCategories = []
        } else {
          // categories: array of objs
          this.selectedCategories = this.categories.map((obj) => { return obj.id })
        }
      })
    },
    exportReport: async function () {
      try {
        if (!this.$store.state.clipboardApi) {
          this.$store.commit(
            'alert',
            {
              show: true,
              text: 'Web Clipboard API is not supported in this browser',
              type: 'error'
            }
          )
        }

        // const text = JSON.stringify(this.groupedSessions)
        const input = this.groupedSessions
        if (!input || input.length === 0) {
          return
        }

        let output = '\tProject\tDate\tTime (min)\tTime (hh:mm)\tCategory\tNotes\n\n'
        output += 'Report OfficeTimePWA from ' + this.startDate + ' to ' + this.endDate + '.\n\n'

        for (const row of input) {
          output += '\t' + row.p + '\t' + row.d + '\t' + row.t + '\t"' + this.formatTime(row.t, true) + '"\t' + row.c + '\t' + row.n + '\n'
          if (row.type === 'subtotal') {
            output += '\n'
          }
        }
        await navigator.clipboard.writeText(output)
      } catch (err) {
        console.err(err)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .noData:hover {
    background-color: inherit !important;
  }
  .dateField {
    margin-top: 1px !important;
  }
</style>
