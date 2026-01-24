<template>
  <v-dialog
    fullscreen
    :scrim="false"
    persistent
    no-click-animation
    eager
    v-model="show"
    @keydown.esc="show = false"
  >
    <v-card>
      <v-toolbar
        class="dlgSticky"
        color="transparent"
        :elevation="1"
      >
        <v-btn
          icon
          @click="show = false"
        >
          <v-icon icon="$mdiClose" />
        </v-btn>
        <v-toolbar-title>Projects</v-toolbar-title>
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          @click="editItem(null)"
        >
          Create project
        </v-btn>
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
                :items-per-page-options="itemsPerPageOptions"
                fixed-header
                height="calc(100vh - 150px)"
              >
                <template v-slot:item.defaultCategory="{ item }">
                  <span>
                    {{ categoryTitleLookup[(item.raw || item).defaultCategory] }}
                  </span>
                </template>
                <template v-slot:item.archived="{ item }">
                  <v-icon
                    v-if="(item.raw || item).archived"
                    size="small"
                    icon="$mdiCheckBold"
                  />
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    size="small"
                    class="mr-4"
                    color="primary"
                    @click="editItem((item.raw || item).id)"
                    icon="$mdiPencil"
                  />
                  <v-icon
                    size="small"
                    color="primary"
                    @click="deleteItem((item.raw || item).id)"
                    icon="$mdiDelete"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
        <ProjectEdit
          v-model="showEditDlg"
          :itemId="editedItemId"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ProjectEdit from '@/components/ProjectEdit'
import EventBus from '@/components/EventBus'

export default {
  components: {
    ProjectEdit
  },
  data () {
    return {
      headers: [
        { title: 'Name ', key: 'title' },
        { title: 'Default category ', key: 'defaultCategory' },
        { title: 'Archived ', key: 'archived' },
        { title: 'Notes ', key: 'notes' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      itemsPerPageOptions: [10, 25, 100, -1],
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
      return this.$store.getters.getProjects()
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
      const projects = this.$store.getters.getProjects(true)
      const selectedProjectId = projects[0] ? projects[0].id : null
      await this.$store.dispatch('updateSetting', { key: 'selectedProjectId', value: selectedProjectId })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
