<template>
  <v-dialog
    :value="show"
    @keydown.esc="show = false"
    max-width="500px"
    :overlayColor="$vuetify.theme.dark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
  >
    <v-card>
      <v-form
        @submit.prevent="save(true)"
        ref="form"
        v-model="valid"
        lazy-validation
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
                ></v-text-field>
                <v-textarea
                  :value="expense.n"
                  label="Comments"
                  rows="3"
                ></v-textarea>
                <v-text-field
                  :value="expense.d"
                  type="datetime-local"
                  required
                ></v-text-field>
                <v-select
                  v-model="expense.p"
                  :items="projects"
                  label="Project"
                  item-text="title"
                  item-value="id"
                >
                </v-select>
                  <v-select
                  :value="expense.c"
                  :items="categories"
                  label="Category"
                  item-text="title"
                  item-value="id"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="show = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            @click="save"
          >
            Save
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            text
          >
            Add another
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
// import EventBus from '@/components/EventBus'

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
    projects () {
      return this.$store.state.projects
    },
    categories () {
      return this.$store.state.categories
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
      const activeProjectId = this.$store.getters.getSetting('activeProjectId')
      const defaultCategory = this.$store.getters.getProject(activeProjectId).defaultCategory
      // local time string in format "yyyy-MM-ddThh:mm:ss"
      // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
      const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
      const localDateTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -8)
      return {
        p: activeProjectId,
        e: true, // expense
        d: localDateTime, // start
        t: 0, // time
        a: 0, // amount
        c: defaultCategory,
        r: 0, // ignore defaultCategoryRate
        n: ''
      }
    },
    async save (next) {
      console.log('save')
      if (!this.$refs.form.validate()) {
        return
      }

      // cast to number
      this.expense.a = +this.expense.a

      await this.$store.dispatch('createExpense', this.expense)
      // switch project if changed
      if (this.expense.p !== this.activeProjectId) {
        await this.$store.dispatch('updateSetting', { key: 'activeProjectId', value: this.expense.p })
      }
      if (next) {
        this.expense = this.initExpense()
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
