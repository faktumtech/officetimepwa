<template>
  <v-row
    row
  >
    <v-dialog
      :value="modalDlg.show"
      @keydown.esc="cancel"
      persistent
      max-width="400px">
      <v-card>
        <v-card-title>
          <h3 class="headline mb-0">{{ this.modalDlg.title }}</h3>
        </v-card-title>
        <v-card-text>
          {{ this.modalDlg.text }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="cancel"
            text
          >{{ this.modalDlg.cancelText }}</v-btn>
          <v-btn
            color="primary"
            @click="confirm"
            text
          >{{ this.modalDlg.confirmText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import EventBus from '@/components/EventBus'

export default {
  computed: {
    modalDlg () {
      return this.$store.state.modalDlg
    }
  },
  methods: {
    confirm: function () {
      EventBus.$emit(this.modalDlg.eventName, 'confirm')
    },
    cancel: function () {
      EventBus.$emit(this.modalDlg.eventName, 'cancel')
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
