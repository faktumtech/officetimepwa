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
        <v-toolbar-title>Projects</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            text
            color="primary"
            @click="editItem(null)"
          >
            Create project
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text
        class="dlgScroll"
      >
        <v-container
          fluid
        >
          <v-row>
            <v-col
              cols="12"
            >
              <v-data-table
                  :mobile-breakpoint="0"
                  :headers="headers"
                  :items="projects"
                  :items-per-page="100"
                  :sort-by="'id'"
                  :sort-desc="true"
                >
                  <template v-slot:[`item.defaultCategory`]="{ item }">
                    <span>
                      {{ categoryLookup[item.defaultCategory] }}
                    </span>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                      small
                      class="mr-2"
                      @click="editItem(item.id)"
                    >
                      {{ mdiPencil }}
                    </v-icon>
                    <v-icon
                      small
                      @click="deleteItem(item.id)"
                    >
                      {{ mdiDelete}}
                    </v-icon>
                  </template>
                </v-data-table>
            </v-col>
          </v-row>
        </v-container>
        <ProjectEdit
          v-model="showEditDlg"
          :itemId="editedItemId"
        >
        </ProjectEdit>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ProjectEdit from '@/components/ProjectEdit'
import EventBus from '@/components/EventBus'
import { mdiClose, mdiPencil, mdiDelete } from '@mdi/js'

export default {
  components: {
    ProjectEdit
  },
  data () {
    return {
      mdiClose: mdiClose,
      mdiPencil: mdiPencil,
      mdiDelete: mdiDelete,
      headers: [
        { text: 'Name ', value: 'title' },
        { text: 'Default category ', value: 'defaultCategory' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      showEditDlg: false,
      showDeleteDlg: false,
      editedItemId: null
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'projects'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'projects' : false)
      }
    },
    projects () {
      return this.$store.state.projects
    },
    categoryLookup () {
      return this.$store.getters.categoryLookup()
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: function (show) {
        if (show && (!this.projects || this.projects.length === 0)) {
          console.log('test')
          setTimeout(() => {
            this.editItem(null)
          }, 500)
        }
      }
    }
  },
  methods: {
    editItem (itemId) {
      console.log('editItem', itemId)
      this.editedItemId = itemId
      this.showEditDlg = true
    },
    deleteItem: function (itemId) {
      const project = this.$store.getters.getProject(itemId)
      const modalDlg = {
        title: 'Delete project',
        text: 'The project ' + project.title + ' and all saved timers will be deleted. This action can not be undone.',
        confirmText: 'Delete project'
      }
      this.$store.commit('showModalDlg', modalDlg)

      EventBus.$on('modalEvent', (e) => {
        this.$store.commit('hideModalDlg')
        EventBus.$off('modalEvent')
        if (e === 'confirm') {
          this.deleteItemConfirm(itemId)
        }
      })
    },
    deleteItemConfirm: async function (itemId) {
      await this.$store.dispatch('deleteProject', itemId)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>