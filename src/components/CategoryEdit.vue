<template>
  <v-dialog
    v-model="show"
    max-width="500px"
    :overlayColor="$vuetify.theme.dark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
  >
    <v-card>
      <v-form
        @submit.prevent="save"
        ref="form"
        v-model="valid"
        lazy-validation
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
                ></v-text-field>
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
                ></v-text-field>
                <small>*required</small>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            text
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>

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
    value: {
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
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    formTitle () {
      return this.itemId === null ? 'New category' : 'Edit category'
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
      if (!this.$refs.form.validate()) {
        return
      }
      if (this.itemId === null) {
        await this.$store.dispatch('createCategory', this.category)
      } else {
        const payload = { id: this.itemId, changes: this.category }
        await this.$store.dispatch('updateCategory', payload)
      }
      this.close()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
