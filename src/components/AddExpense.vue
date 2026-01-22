<template>
  <v-dialog
    persistent
    v-model="show"
    @keydown.esc="show = false"
    max-width="500px"
    :scrim="isDark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
  >
    <v-card>
      <v-form
        @submit.prevent="save(true)"
        ref="form"
        v-model="valid"
      >
        <v-card-title>
          <span class="headline">Add expense</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="expense.a"
                  label="Amount *"
                  type="number"
                  :rules="amountRules"
                />
                <v-textarea
                  v-model="expense.n"
                  label="Comments"
                  rows="3"
                />
                <v-text-field
                  v-model="expense.d"
                  type="datetime-local"
                  required
                />
                <v-select
                  v-model="expense.p"
                  :items="activeProjects"
                  label="Project"
                  item-title="title"
                  item-value="id"
                />
                <v-select
                  v-model="expense.c"
                  :items="categories"
                  label="Category"
                  item-title="title"
                  item-value="id"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="show = false"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="text"
            @click="save(false)"
          >
            Save
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="text"
          >
            Add another
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import Utils from '@/utils/Utils'

export default {
  data () {
    return {
      valid: false,
      expense: {},
      amountRules: [
        // positive decimal
        (v) => /^\d*\.{0,1}\d+$/.test(v) || 'A amount is required and has to be >= 0'
      ]
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'addExpense'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'addExpense' : false)
      }
    },
    activeProjects () {
      // active projects
      return this.$store.getters.getProjects(true)
    },
    categories () {
      return this.$store.state.categories
    },
    selectedProjectId () {
      return this.$store.getters.getSetting('selectedProjectId')
    },
    isDark () {
      const current = this.$vuetify?.theme?.global?.current?.value
      if (current && typeof current.dark !== 'undefined') {
        return current.dark
      }
      return this.$store.getters.getSetting('dark')
    }

  },
  watch: {
    show: function (show) {
      if (show) {
        this.expense = this.initExpense()
      }
    }
  },
  methods: {
    initExpense () {
      console.log('initExpense')
      const selectedProjectId = this.$store.getters.getSetting('selectedProjectId')
      const defaultCategory = this.$store.getters.getProject(selectedProjectId).defaultCategory
      return {
        p: selectedProjectId,
        e: true, // expense
        d: Utils.formatDateToLocalDateTimeIsoStr(new Date()).slice(0, -3), // start without seconds
        t: 0, // time
        a: 0, // amount
        c: defaultCategory,
        r: 0, // ignore defaultCategoryRate
        n: ''
      }
    },
    async save (next) {
      console.log('save')
      const { valid } = await this.$refs.form.validate()
      if (!valid) {
        return
      }

      // cast to number
      this.expense.a = +this.expense.a

      await this.$store.dispatch('createExpense', this.expense)
      // switch project if changed
      if (this.expense.p !== this.selectedProjectId) {
        await this.$store.dispatch('updateSetting', { key: 'selectedProjectId', value: this.expense.p })
      }
      if (next) {
        this.expense = this.initExpense()
        this.show = false
        setTimeout(() => {
          this.show = true
          // set focus to amount
        }, 300)
      } else {
        this.show = false
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
