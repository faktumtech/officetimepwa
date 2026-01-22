<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col
        cols="12"
        md="8"
        offset-md="2"
        lg="6"
        offset-lg="3"
        xl="4"
        offset-xl="4"
      >
        <p
          class="text-h4 text-primary d-flex align-center"
        >
          <IconLogo class="logoIcon mr-3" />
          OfficeTimePwa
        </p>
        <p
          class="body-1"
        >
          Time tracking tool for freelancers. Heavely inspired by OfficeTime. All data is stored locally in the browser (through IndexedDB) and is never send to any server.
        </p>
        <p
          class="text-center"
        >
          <v-btn
            class="ma-6"
            color="primary"
            size="x-large"
            @click="showModalComponent('projects')"
          >
            Create your first project
          </v-btn>
        </p>
        <p
          class="body-1"
        >
          This application is designed as a Progressive Web Application (PWA) and once installed ('Add to desktop') it can be used offline.
        </p>
        <p
          class="body-1"
        >
          Copyright <b>cfbutt</b>. Licensed under GPL v3. Source code at <a target="_blank" rel="noopener noreferrer" href="https://github.com/cfbutt/officetimepwa">https://github.com/cfbutt/officetimepwa</a>.
        </p>

        <v-alert
          :icon="mdiDeleteAlert"
          prominent
          variant="text"
          type="info"
        >
          Clearing the browsers site data, will delete all data stored by OfficeTimePwa! <b>Please make backups regularly!</b>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import IconLogo from '@/components/IconLogo'
import { mdiDeleteAlert } from '@mdi/js'

export default {
  components: {
    IconLogo
  },
  data: () => ({
    mdiDeleteAlert: mdiDeleteAlert
  }),
  methods: {
    showModalComponent: function (component) {
      this.$store.commit('showModalComponent', component)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logoIcon {
    width: 32px;
    height: 32px;
  }
</style>
