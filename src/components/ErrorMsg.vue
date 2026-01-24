<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col class="ma-2">
            <v-alert
              color="error"
              icon="$mdiAlert"
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

export default {
  props: {
    msg: String
  },
  data: () => ({}),
  mounted: function () {
    console.log('error msg')
  }
}
</script>
