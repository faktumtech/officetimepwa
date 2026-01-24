<template>
  <v-row>
    <v-dialog
      :model-value="modalDlg.show"
      @keydown.esc="cancel"
      persistent
      max-width="400px"
      :scrim="isDark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
    >
      <v-card>
        <v-card-title>
          {{ this.modalDlg.title }}
        </v-card-title>
        <v-card-text>
          {{ this.modalDlg.text }}
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="cancel"
            variant="text"
          >{{ this.modalDlg.cancelText }}</v-btn>
          <v-btn
            color="primary"
            @click="confirm"
            variant="text"
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
    },
    isDark () {
      const current = this.$vuetify?.theme?.global?.current?.value
      if (current && typeof current.dark !== 'undefined') {
        return current.dark
      }
      return this.$store.getters.getSetting('dark')
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
<style>
</style>
