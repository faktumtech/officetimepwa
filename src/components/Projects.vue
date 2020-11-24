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
        class="dlgScroll pa-0"
      >
        <v-container
          fluid
        >
          <v-row
            no-gutters
          >
            <v-col
              cols="12"
            >
              <v-data-table
                :mobile-breakpoint="0"
                :headers="headers"
                :items="projects"
                :items-per-page="10"
                :footer-props="footerProps"
                :sort-by="'id'"
                :sort-desc="true"
                fixed-header
                height="calc(100vh - 150px)"
              >
                <template v-slot:[`item.active`]="{ item }">
                  <v-icon
                    v-if="item.active"
                    small
                  >
                    {{ mdiCheckBold }}
                  </v-icon>
                </template>
                <template v-slot:[`item.defaultCategory`]="{ item }">
                  <span>
                    {{ categoryTitleLookup[item.defaultCategory] }}
                  </span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    small
                    class="mr-4"
                    color="primary"
                    @click="editItem(item.id)"
                  >
                    {{ mdiPencil }}
                  </v-icon>
                  <v-icon
                    small
                    color="primary"
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
import { mdiClose, mdiPencil, mdiDelete, mdiCheckBold } from '@mdi/js'

export default {
  components: {
    ProjectEdit
  },
  data () {
    return {
      mdiClose: mdiClose,
      mdiPencil: mdiPencil,
      mdiDelete: mdiDelete,
      mdiCheckBold: mdiCheckBold,
      headers: [
        { text: 'Active ', value: 'active' },
        { text: 'Name ', value: 'title' },
        { text: 'Default category ', value: 'defaultCategory' },
        { text: 'Notes ', value: 'notes' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      footerProps: {
        'items-per-page-options': [10, 25, 100, -1]
      },
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
    categoryTitleLookup () {
      return this.$store.getters.categoryTitleLookup()
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: function (show) {
        if (show && (!this.projects || this.projects.length === 0)) {
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

      EventBus.$on('modalEvent', async (e) => {
        EventBus.$off('modalEvent')
        // mantain dlg open during execution
        if (e === 'confirm') {
          await this.deleteItemConfirm(itemId)
        }
        this.$store.commit('hideModalDlg')
      })
    },
    deleteItemConfirm: async function (itemId) {
      await this.$store.dispatch('deleteProject', itemId)
      const firstProject = this.projects[0]
      const selectedProjectId = firstProject ? firstProject.id : null
      await this.$store.dispatch('updateSetting', { key: 'selectedProjectId', value: selectedProjectId })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
