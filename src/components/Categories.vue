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
        <v-toolbar-title>Categories</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            text
            color="primary"
            @click="editItem(null)"
          >
            Create category
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
                :items="categories"
                :items-per-page="10"
                :footer-props="footerProps"
                :sort-by="'id'"
                :sort-desc="true"
                fixed-header
                height="calc(100vh - 150px)"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    small
                    class="mr-4"
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
        <CategoryEdit
          v-model="showEditDlg"
          :itemId="editedItemId"
        >
        </CategoryEdit>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import CategoryEdit from '@/components/CategoryEdit'
import EventBus from '@/components/EventBus'
import db from '@/db'
import { mdiClose, mdiPencil, mdiDelete } from '@mdi/js'

export default {
  components: {
    CategoryEdit
  },
  data () {
    return {
      mdiClose: mdiClose,
      mdiPencil: mdiPencil,
      mdiDelete: mdiDelete,
      headers: [
        { text: 'Name ', value: 'title' },
        { text: 'Rate ', value: 'rate' },
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
        return this.$store.state.showModalComponent === 'categories'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'categories' : false)
        this.$store.commit('alert', { show: false }) // hide alert when closing modal
      }
    },
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    editItem (itemId) {
      this.editedItemId = itemId
      this.showEditDlg = true
    },
    deleteItem: async function (itemId) {
      // mantain a least one category
      if (this.categories.length === 1) {
        this.$store.commit(
          'alert',
          {
            show: true,
            text: 'At least on category is required.',
            type: 'error'
          }
        )
        return
      }

      // check if category is used in sessions or as the default category of a project
      if (await db.categoryIdIsUsed(itemId)) {
        this.$store.commit(
          'alert',
          {
            show: true,
            text: 'Category is used in sessions or as default category of a project',
            type: 'error'
          }
        )
        return
      }

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
      await this.$store.dispatch('deleteCategory', itemId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
