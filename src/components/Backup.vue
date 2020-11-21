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
                <p>
                  Please remember that due to the nature of Progressive Web Apps (Pwa) the clearing the browsers site data, will delete all data stored by OfficeTimePwa!<br>
                </p>
                <p>
                  <b>Please make backups regularly and move them from the download folder to save location!</b>
                </p>
                <p>
                  Your last backup is from <b>{{ $store.getters.getSetting('lastBackupDate') }}</b>
                </p>
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
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Utils from '@/utils/Utils'
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
    emptyDb: async function () {
      await db.dbErase()
    },
    saveBackup: async function () {
      try {
        // formatDateToLocalDateIsoStr => from mixins
        const dateTimeStr = Utils.formatDateToLocalDateTimeIsoStr(new Date())
        const filename = 'officetime_backup_' + dateTimeStr + '.bak'
        const backupStr = await db.dbBackup(dateTimeStr)
        await this.$store.dispatch('updateSetting', { key: 'lastBackupDate', value: dateTimeStr })

        const blob = new Blob([backupStr], { type: '"text/plain;charset=utf-8' })
        saveAs(blob, filename)
        this.$store.commit('alert',
          {
            show: true,
            text: 'Backup saved successfully to download folder! Please move the backup to a save location!',
            type: 'warning',
            timeout: 15000
          }
        )
      } catch (err) {
        this.$store.commit('alert',
          {
            show: true,
            text: 'An error has occurred creating backup!',
            type: 'error',
            timeout: 15000
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
      EventBus.$on('modalEvent', async (e) => {
        EventBus.$off('modalEvent')
        this.$store.commit('hideModalDlg')
        if (e === 'confirm') {
          await this.restoreBackupConfirm()
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
            type: 'info',
            timeout: 15000
          }
        )
      } catch (err) {
        this.backup = null
        console.error(err)
        this.$store.commit('alert',
          {
            show: true,
            text: 'Unkown error during restore!',
            type: 'error',
            timeout: 15000
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
