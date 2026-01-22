<template>
  <v-dialog
    v-model="show"
    eager
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
                  v-model="project.title"
                  label="Project name *"
                  :rules="titleRules"
                />
              </v-col>
              <v-col
                cols="12"
              >
                <v-select
                  v-model="project.defaultCategory"
                  :items="categories"
                  item-title="title"
                  item-value="id"
                  label="Default category *"
                />
                <v-textarea
                  v-model="project.notes"
                  label="Notes"
                  rows="3"
                />
                <v-checkbox
                  v-model="project.archived"
                  label="Archived project (not shown in Projects selector)"
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
    selectedProjectId: {
      async set (id) {
        if (id !== this.selectedProjectId) {
          await this.$store.dispatch('updateSetting', { key: 'selectedProjectId', value: id })
        }
      },
      get () {
        return this.$store.getters.getSetting('selectedProjectId')
      }
    },
    categories () {
      return this.$store.state.categories
    },
    formTitle () {
      return this.itemId === null ? 'New project' : 'Edit project'
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
          this.project = {
            title: '',
            defaultCategory: this.categories[0].id,
            notes: '',
            archived: false
          }
        } else {
          // use copy
          this.project = { ...this.$store.getters.getProject(this.itemId) }
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
        await this.$store.dispatch('createProject', this.project)
      } else {
        // unselect project if marked as archived
        if (this.project.id === this.selectedProjectId && this.project.archived) {
          const projects = this.$store.getters.getProjects(true)
          this.selectedProjectId = projects[0] ? projects[0].id : null
        }
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
