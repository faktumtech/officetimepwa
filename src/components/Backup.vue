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
        <v-toolbar-title>Backups</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text
        class="dlgScroll"
      >
        <v-container
          fluid
        >
          <v-row>
            <v-col>
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
          <v-row>
            <v-col
              cols="6"
            >
              <v-btn
                text
                @click="saveBackup"
              >
                Create backup
              </v-btn>
            </v-col>
            <v-col
              cols="6"
            >
          <v-btn
            text
            @click="$refs.uploader.click()"
          >
            Restore backup
          </v-btn>
          <input
            ref="uploader"
            class="d-none"
            type="file"
            accept="*.bak"
            @change="loadBackup"
          >
            </v-col>
          </v-row>
          <!--
          <v-row>
            <v-col>
              <v-btn
                text
                @click="emptyDb"
              >
                Empty db
              </v-btn>
            </v-col>
          </v-row>
          -->
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { saveAs } from 'file-saver'
import EventBus from '@/components/EventBus'
import db from '@/db'
import { mdiClose, mdiDeleteAlert } from '@mdi/js'

export default {
  data: () => ({
    mdiClose: mdiClose,
    mdiDeleteAlert: mdiDeleteAlert,
    backup: {}
  }),
  computed: {
    show: {
      get () {
        return this.$store.state.showModalComponent === 'backup'
      },
      set (value) {
        this.$store.commit('showModalComponent', value ? 'backup' : false)
      }
    }
  },
  methods: {
    getLocalDateTimeStr: function (date) {
      // local date string in format "yyyy-MM-dd"
      // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
      const tzoffset = (date).getTimezoneOffset() * 60000 // offset in milliseconds
      return (new Date(date - tzoffset)).toISOString().slice(0, -5)
    },
    emptyDb: async function () {
      await db.dbErase()
    },
    saveBackup: async function () {
      try {
        const dateTimeStr = this.getLocalDateTimeStr(new Date())
        const filename = 'officetime_backup_' + dateTimeStr + '.bak'
        const backupStr = await db.dbBackup(dateTimeStr)
        await this.$store.dispatch('updateSetting', { key: 'lastBackup', value: dateTimeStr })

        var blob = new Blob([backupStr], { type: '"text/plain;charset=utf-8' })
        saveAs(blob, filename)
        this.$store.commit('alert',
          {
            show: true,
            text: 'Backup saved!',
            type: 'info'
          }
        )
      } catch (err) {
        this.$store.commit('alert',
          {
            show: true,
            text: 'An error has occurred creating backup!',
            type: 'error'
          }
        )
      }
    },
    loadBackup: function (event) {
      const file = event.target.files[0]
      console.log(event.target.files[0])
      const reader = new FileReader()
      reader.readAsText(file)
      this.$refs.uploader.value = null
      reader.onload = () => {
        try {
          const backupStr = reader.result
          console.log(backupStr)
          this.backup = JSON.parse(backupStr)
          this.restoreBackup()
        } catch (err) {
          console.error(err)
          this.loadErrorMsg()
        }
      }
    },
    restoreBackup: function () {
      const meta = this.backup.meta
      if (!meta || !meta.date) {
        this.loadErrorMsg()
        return
      }
      const modalDlg = {
        title: 'Restore backup',
        text: 'Restore backup from ' + meta.date + ' with ' + +meta.projectsCount + ' projects and ' + +meta.sessionsCount + ' sessions? Restoring this backup will overwrite all actual data.',
        confirmText: 'Restore backup'
      }
      this.$store.commit('showModalDlg', modalDlg)
      EventBus.$on('modalEvent', (e) => {
        this.$store.commit('hideModalDlg')
        EventBus.$off('modalEvent')
        if (e === 'confirm') {
          this.restoreBackupConfirm()
        }
      })
    },
    restoreBackupConfirm: async function () {
      try {
        await db.dbErase()
        await db.dbRestore(this.backup)
        this.backup = null
        this.$store.commit('alert',
          {
            show: true,
            text: 'Backup restored successfully!',
            type: 'info'
          }
        )
      } catch (err) {
        this.backup = null
        console.error(err)
        this.$store.commit('alert',
          {
            show: true,
            text: 'Unkown error during restore!',
            type: 'error'
          }
        )
      }
    },
    loadErrorMsg: function () {
      this.$store.commit('alert',
        {
          show: true,
          text: 'This file does not contain a valid backup!',
          type: 'error'
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
