<template>
  <v-dialog
    v-model="show"
    max-width="500px"
    :scrim="isDark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
  >
    <v-card>
      <v-form
        @submit.prevent="save"
        ref="form"
        v-model="valid"
      >
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="category.title"
                  label="Category name *"
                  :rules="titleRules"
                />
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="category.rate"
                  label="Rate *"
                  type="number"
                  :rules="rateRules"
                  min="0"
                />
                <small>*required</small>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="text"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/components/EventBus'

export default {
  data () {
    return {
      valid: false,
      category: {},
      titleRules: [
        (v) => !!v || 'A category name is required'
      ],
      rateRules: [
        // positive decimal
        (v) => /^\d*\.{0,1}\d+$/.test(v) || 'A rate is required and has to be >= 0'
      ]
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  computed: {
    show: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    formTitle () {
      return this.itemId === null ? 'New category' : 'Edit category'
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
      // avoid validation error when reopening form to add project
      if (show) {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
        // initialize form values
        console.log('watch', this.itemId)
        if (this.itemId === null) {
          this.category = {
            title: '',
            rate: 0
          }
        } else {
          // use copy
          this.category = { ...this.$store.getters.getCategory(this.itemId) }
        }
      }
    }
  },
  methods: {
    close () {
      this.$refs.form.resetValidation()
      this.show = false
    },

    async save () {
      const { valid } = await this.$refs.form.validate()
      if (!valid) {
        return
      }
      if (this.itemId === null) {
        await this.$store.dispatch('createCategory', this.category)
      } else {
        // check if rate has changed
        const oldRate = this.$store.getters.getCategory(this.itemId).rate
        const payload = { id: this.itemId, changes: this.category }
        await this.$store.dispatch('updateCategory', payload)
        if (oldRate !== this.category.rate) {
          this.updateRateDlg()
        }
      }
      this.close()
    },
    updateRateDlg () {
      const modalDlg = {
        title: 'Update rates in sessions',
        text: 'Update old sessions with the new rate or only apply to new sessions?',
        confirmText: 'Update old',
        cancelText: 'Apply to new'
      }
      this.$store.commit('showModalDlg', modalDlg)

      EventBus.$on('modalEvent', async (e) => {
        EventBus.$off('modalEvent')
        // mantain dlg open during execution
        if (e === 'confirm') {
          await this.updateRate()
        }
        this.$store.commit('hideModalDlg')
      })
    },
    async updateRate () {
      console.log(this.itemId)
      const payload = { id: this.itemId, rate: this.category.rate }
      await this.$store.dispatch('bulkUpdateSessionsRate', payload)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
