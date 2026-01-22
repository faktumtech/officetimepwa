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
          <v-icon :icon="mdiClose" />
        </v-btn>
        <v-toolbar-title>Categories</v-toolbar-title>
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          @click="editItem(null)"
        >
          Create category
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
                density="compact"
                :mobile-breakpoint="0"
                :headers="headers"
                :items="categories"
                :items-per-page="10"
                :items-per-page-options="itemsPerPageOptions"
                :sort-by="[{ key: 'id', order: 'desc' }]"
                fixed-header
                height="calc(100vh - 150px)"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    size="small"
                    class="mr-4"
                    @click="editItem((item.raw || item).id)"
                    :icon="mdiPencil"
                  />
                  <v-icon
                    size="small"
                    @click="deleteItem((item.raw || item).id)"
                    :icon="mdiDelete"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
        <CategoryEdit
          v-model="showEditDlg"
          :itemId="editedItemId"
        />
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
        { title: 'Name ', key: 'title' },
        { title: 'Rate ', key: 'rate' },
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
            text: 'This category can not be deleted! At least one category is required.',
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
            text: 'This category can not be deleted! It is used in sessions or as default category of a project.',
            type: 'error'
          }
        )
        return
      }

      const category = this.$store.getters.getCategory(itemId)
      const modalDlg = {
        title: 'Delete category',
        text: 'The category ' + category.title + ' will be deleted. This action can not be undone.',
        confirmText: 'Delete category'
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
