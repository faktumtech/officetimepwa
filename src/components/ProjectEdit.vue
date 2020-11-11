<template>
  <v-dialog
    v-model="show"
    max-width="500px"
    :overlayColor="$vuetify.theme.dark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="project.title"
                  label="Project name *"
                  :rules="titleRules"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
              <v-select
                v-model="project.defaultCategory"
                :items="categories"
                item-text="title"
                item-value="id"
                label="Default category *"
              ></v-select>
              <small>*required</small>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
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
          text
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data () {
    return {
      valid: false,
      project: {},
      titleRules: [
        (v) => !!v || 'A project name is required'
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
    categories () {
      return this.$store.state.categories
    },
    formTitle () {
      return this.itemId === null ? 'New project' : 'Edit project'
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
          this.project = {
            title: '',
            defaultCategory: this.categories[0].id
          }
        } else {
          this.project = this.$store.getters.getProject(this.itemId)
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
        await this.$store.dispatch('createProject', this.project)
      } else {
        const payload = { id: this.itemId, changes: this.project }
        await this.$store.dispatch('updateProject', payload)
      }
      this.close()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
