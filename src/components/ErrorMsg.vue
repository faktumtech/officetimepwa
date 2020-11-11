<template>
  <v-app
  >
    <v-main>
      <v-container>
        <v-row>
          <v-col ma-2>
            <v-alert
              color="error"
              :icon="mdiAlert"
            >
              {{ msg }}
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import { mdiAlert } from '@mdi/js'

export default {
  props: {
    msg: String
  },
  data: () => ({
    mdiAlert: mdiAlert
  }),
  mounted: function () {
    console.log('error msg')
  }
}
</script>
