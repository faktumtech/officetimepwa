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
            color="primary"
            @click="copyReport(true)"
            :disabled="!rawSessions || rawSessions.length === 0"
          >
            Copy to clipboard
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn
            text
            color="primary"
            @click="saveReport(false)"
            :disabled="!rawSessions || rawSessions.length === 0"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text
        class="dlgScroll pa-0"
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
            :items-per-page="10"
            :footer-props="footerProps"
            :sort-by="'id'"
            :sort-desc="true"
            :loading="loading"
            disable-sort
            class="sessionsTable mt-6"
            dense
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
                    colspan="6"
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
                    {{ projectTitleLookup[item.p] }}
                  </td>
                  <td v-else colspan="2">
                      <b>{{ item.p }}</b>
                  </td>
                  <td v-if="item.type === 'session' || item.type === 'expense'">
                    {{ Utils.formatDate(item.d) }}
                  </td>
                  <td
                    class="text-end timeField"
                  >
                    <span v-if="item.type === 'session' || item.type === 'expense'">
                      {{ Utils.formatTime(item.t) }}
                    </span>
                    <span v-else>
                      <b>{{ Utils.formatTime(item.t) }}</b>
                    </span>
                  </td>
                  <td
                    class="text-end"
                  >
                    <span v-if="item.type === 'session' || item.type === 'expense'">
                      {{ Utils.formatAmount(item.a, 2) }}
                    </span>
                    <span v-else>
                      <b>{{ Utils.formatAmount(item.a, 2) }}</b>
                    </span>
                  </td>
                  <td
                    class="tableCategoryRow"
                  >
                    {{ categoryTitleLookup[item.c] }}
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
import Utils from '@/utils/Utils'
import db from '@/db'
import { mdiClose, mdiDatabaseOff, mdiCloseBox, mdiMinusBox, mdiCheckboxBlankOutline } from '@mdi/js'
import { saveAs } from 'file-saver'

export default {
  beforeCreate () {
    this.Utils = Utils
  },
  data () {
    return {
      mdiClose: mdiClose,
      mdiDatabaseOff: mdiDatabaseOff,
      headers: [
        { text: 'Project', value: 'p' },
        { text: 'Date', value: 'd' },
        { text: 'Time', value: 't', align: 'end' },
        { text: 'Amount', value: 'a', align: 'end' },
        { text: 'Category', value: 'c' },
        { text: 'Notes', value: 'n' }
      ],
      footerProps: {
        'items-per-page-options': [10, 25, 100, -1]
      },
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
      // return this.$store.state.projects
      // do not exclude archived projects
      return this.$store.getters.getProjects()
    },
    projectTitleLookup () {
      return this.$store.getters.projectTitleLookup()
    },
    categories () {
      return this.$store.state.categories
    },
    categoryTitleLookup () {
      return this.$store.getters.categoryTitleLookup()
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
      // today
      this.dateRange = 2
      // preselect all categories
      this.selectedCategories = this.categories.map((obj) => { return obj.id })
      // preselect all projects
      this.selectedProjects = this.projects.map((obj) => { return obj.id })
      // group by projects
      this.groupByProject = true
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
    getDatePresets: function () {
      const today = new Date()
      const longAgo = new Date(2000, 0, 1) // month jan = 0
      const weekStart = new Date(new Date().setDate(today.getDate() - today.getDay()))
      const yearStart = new Date(today.getFullYear(), 0, 1) // month jan = 0
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      // formatDateToLocalDateIsoStr => from mixins
      console.log(Utils.formatDateToLocalDateIsoStr(today), Utils.formatDateToLocalDateIsoStr(monthStart), Utils.formatDateToLocalDateIsoStr(yearStart))
      return [
        {
          id: 1,
          title: 'All times',
          startDate: Utils.formatDateToLocalDateIsoStr(longAgo),
          endDate: Utils.formatDateToLocalDateIsoStr(today)
        },
        {
          id: 2,
          title: 'Today',
          startDate: Utils.formatDateToLocalDateIsoStr(today),
          endDate: Utils.formatDateToLocalDateIsoStr(today)
        },
        {
          id: 3,
          title: 'This week',
          startDate: Utils.formatDateToLocalDateIsoStr(weekStart),
          endDate: Utils.formatDateToLocalDateIsoStr(today)
        },
        {
          id: 4,
          title: 'This month',
          startDate: Utils.formatDateToLocalDateIsoStr(monthStart),
          endDate: Utils.formatDateToLocalDateIsoStr(today)
        },
        {
          id: 5,
          title: 'This year',
          startDate: Utils.formatDateToLocalDateIsoStr(yearStart),
          endDate: Utils.formatDateToLocalDateIsoStr(today)
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
        // sort
        input.sort((a, b) => {
          // order by p (project), c (category), d (date)
          if (this.groupByProject && this.groupByCategory) {
            // sort by project title rather than project
            const ap = this.projectTitleLookup[a.p] || ''
            const bp = this.projectTitleLookup[b.p] || ''
            // sort by category title rather than category
            const ac = this.categoryTitleLookup[a.c] || ''
            const bc = this.categoryTitleLookup[b.c] || ''

            // check first level
            if (ap < bp) {
              return -1
            } else if (ap > bp) {
              return 1
            } else {
              // check second level
              if (ac < bc) {
                return -1
              } else if (ac > bc) {
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
            const ap = this.projectTitleLookup[a.p] || ''
            const bp = this.projectTitleLookup[b.p] || ''

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
            // sort by category title rather than category
            const ac = this.categoryTitleLookup[a.c] || ''
            const bc = this.categoryTitleLookup[b.c] || ''

            // check first level
            if (ac < bc) {
              return -1
            } else if (ac > bc) {
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
        let actProjectRows = 0
        let actCategoryRows = 0
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
            // only push subtotal if containing rows
            if (actCategoryRows) {
              output.push({
                p: 'Sum category "' + this.categoryTitleLookup[actCategory] + '"',
                pTitle: '',
                d: '',
                t: actCategoryTime,
                a: actCategoryAmount,
                e: '',
                c: '',
                cTitle: '',
                r: null,
                n: '',
                type: 'subtotal'
              })
            }
            actCategoryRows = 0
            actCategoryTime = 0
            actCategoryAmount = 0
            actCategory = row.c
          }
          // make project subtotal if change of project
          if (this.groupByProject && actProject !== row.p) {
            // only push subtotal if containing rows
            if (actProjectRows) {
              output.push({
                p: 'Sum project "' + this.projectTitleLookup[actProject] + '"',
                pTitle: '',
                d: '',
                t: actProjectTime,
                a: actProjectAmount,
                e: '',
                c: '',
                cTitle: '',
                r: null,
                n: '',
                type: 'subtotal'
              })
            }
            actProjectRows = 0
            actProjectTime = 0
            actProjectAmount = 0
            actProject = row.p
          }
          if (this.showSessions && !row.e) {
            output.push({
              p: row.p,
              pTitle: this.projectTitleLookup[row.p] || '',
              d: row.d,
              t: row.t,
              a: row.a,
              e: row.e,
              c: row.c,
              cTitle: this.categoryTitleLookup[row.c] || '',
              r: row.r,
              n: row.n,
              type: 'session'
            })
          }
          if (this.showExpenses && row.e) {
            output.push({
              p: row.p,
              pTitle: this.projectTitleLookup[row.p] || '',
              d: row.d,
              t: row.t,
              a: row.a,
              e: row.e,
              c: row.c,
              cTitle: this.categoryTitleLookup[row.c] || '',
              r: 0,
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
            actCategoryRows++
            actProjectRows++
            actTotalTime += row.t
            actProjectTime += row.t
            actCategoryTime += row.t
            actTotalAmount += row.a
            actProjectAmount += row.a
            actCategoryAmount += row.a
          }
        }
        // final category subtotal
        if (this.groupByCategory && actCategoryRows) {
          output.push({
            p: 'Sum category "' + this.categoryTitleLookup[actCategory] + '"',
            pTitle: '',
            d: '',
            t: actCategoryTime,
            a: actCategoryAmount,
            e: '',
            c: '',
            cTitle: '',
            r: null,
            n: '',
            type: 'subtotal'
          })
        }
        // final project subtotal
        if (this.groupByProject && actProjectRows) {
          output.push({
            p: 'Sum project "' + this.projectTitleLookup[actProject] + '"',
            pTitle: '',
            d: '',
            t: actProjectTime,
            a: actProjectAmount,
            e: '',
            c: '',
            cTitle: '',
            r: null,
            n: '',
            type: 'subtotal'
          })
        }

        // final total (always)
        output.push({
          p: 'TOTAL SUM',
          pTitle: '',
          d: '',
          t: actTotalTime,
          a: actTotalAmount,
          e: '',
          c: '',
          cTitle: '',
          r: null,
          n: '',
          type: 'total'
        })
      }

      this.groupedSessions = output
      this.loading = false
      console.log('formatSessions', this.groupedSessions.length)
    },

    toggleProjectSelect () {
      this.$nextTick(() => {
        if (this.allProjectsSelected) {
          this.selectedProjects = []
        } else {
          // projects: array of objIds
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
    // prepare report for export in tab separated format
    prepareExport: function () {
      const input = this.groupedSessions
      if (!input || input.length === 0) {
        return false
      }

      let output = '\tProjectId\tProjectTitle\tDate\tTime (min)\tTime (hh:mm)\tRate\tAmount\tIsExpense\tCategoryId\tCategoryTitle\tNotes\n\n'
      output += 'Report OfficeTimePWA from ' + this.startDate + ' to ' + this.endDate + '.\n\n'

      for (const row of input) {
        if (row.type === 'subtotal' || row.type === 'total') {
          output += row.p + '\t' + '\t' + '\t' + '\t' + row.t + '\t"' + Utils.formatTime(row.t, true) + '"\t' + '\t' + row.a + '\t' + '\t' + '\t' + '\t' + '\n'
        } else {
          output += '\t' + row.p + '\t"' + row.pTitle + '"\t' + row.d + '\t' + row.t + '\t"' + Utils.formatTime(row.t, true) + '"\t' + row.r + '\t' + row.a + '\t' + row.e + '\t' + row.c + '\t"' + row.cTitle + '"\t"' + row.n + '"\n'
        }
        if (row.type === 'subtotal') {
          output += '\n'
        }
      }
      return output
    },
    copyReport: async function () {
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
          return
        }
        const output = this.prepareExport()
        await navigator.clipboard.writeText(output)
      } catch (err) {
        this.$store.commit('alert',
          {
            show: true,
            text: 'An error has occurred copying this report to the clipboard!',
            type: 'error'
          }
        )
      }
    },
    saveReport: async function () {
      try {
        const dateTimeStr = Utils.formatDateToLocalDateTimeIsoStr(new Date())
        const filename = 'officetime_report_' + dateTimeStr + '.csv'
        const output = this.prepareExport()
        const blob = new Blob([output], { type: '"text/plain;charset=utf-8' })
        saveAs(blob, filename)
        this.$store.commit('alert',
          {
            show: true,
            text: 'Report saved successfully to download folder!',
            type: 'info'
          }
        )
      } catch (err) {
        console.log(err)
        this.$store.commit('alert',
          {
            show: true,
            text: 'An error has occurred saving report!',
            type: 'error'
          }
        )
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
  .timeField {
    white-space: nowrap;
  }
</style>
