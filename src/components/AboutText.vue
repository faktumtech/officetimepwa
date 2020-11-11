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
          class="text-h4 primary--text"
        >
          <v-icon
            x-large
            class="mr-3"
          >
            $vuetify.icons.logo
          </v-icon>
          OfficeTimePwa
        </p>
        <p
          class="body-1"
        >
          Time tracking tool for freelancers. Heavely inspired by OfficeTime. All data is stored locally in the browser (through IndexedDB) and is never send to any server.
        </p>
        <p
          class="body-1"
        >
          This application is designed as a Progressive Web Application (PWA) and once installed ('Add to desktop') it can be used offline.
        </p>
        <p
          class="body-1"
        >
          Copyright <b>cfbutt</b>. Licensed under GPL v3. <!--Source code at <a href="https://github.com/cfbutt/officetimepwa">https://github.com/cfbutt/officetimepwa</a>.-->
        </p>

        <v-alert
          :icon="mdiDeleteAlert"
          prominent
          text
          type="info"
        >
          Remember that clearing the browsers site data, will delete all data stored by OfficeTimePwa! Please make backups regularly.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiDeleteAlert } from '@mdi/js'

export default {
  data: () => ({
    mdiDeleteAlert: mdiDeleteAlert
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
