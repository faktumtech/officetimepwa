import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg' // iconset for vuetify

// we could import basic icons used by vuetify from @mdi/js
// see https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/iconsets/mdi.ts
// and replace aliases from mdi-svg with imports from @mdi/js
// but this saves only about 10kb of raw bundle size. Not worth the effort.

// import only the icons used by this app
import {
  mdiAlert,
  mdiAlertOctagon,
  mdiCheckboxBlankOutline,
  mdiCheckBold,
  mdiClose,
  mdiCloseBox,
  mdiCurrencyUsd,
  mdiDatabaseImport,
  mdiDatabaseOff,
  mdiDelete,
  mdiDeleteAlert,
  mdiDotsVertical,
  mdiInformation,
  mdiMinusBox,
  mdiPencil,
  mdiPlay,
  mdiPlayPause,
  mdiPlus,
  mdiStop,
  mdiThumbUp
} from '@mdi/js'

const lightTheme = {
  dark: false,
  colors: {
    primary: '#2196f3'
  }
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#2196f3'
  }
}

export default createVuetify({
  defaults: {
    VTextField: {
      density: 'compact',
      color: 'primary',
      persistentPlaceholder: true
    },
    VSelect: {
      density: 'compact',
      color: 'primary'
    },
    VTextarea: {
      density: 'compact',
      color: 'primary',
      persistentPlaceholder: true

    },
    VCheckbox: {
      density: 'compact',
      color: 'primary'
    },
    VRadio: {
      density: 'compact',
      color: 'primary'
    },
    VSwitch: {
      density: 'compact',
      color: 'primary'
    },
    VCard: {
      // variant: 'elevated' // default
    }
  },
  // components,
  // directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      // add here only the icons used by this app
      // these icons can then be used in components, without extra imports, like this:
      // <v-icon icon="$mdiCheck" />
      mdiAlert,
      mdiAlertOctagon,
      mdiCheckboxBlankOutline,
      mdiCheckBold,
      mdiClose,
      mdiCloseBox,
      mdiCurrencyUsd,
      mdiDatabaseImport,
      mdiDatabaseOff,
      mdiDelete,
      mdiDeleteAlert,
      mdiDotsVertical,
      mdiInformation,
      mdiMinusBox,
      mdiPencil,
      mdiPlay,
      mdiPlayPause,
      mdiPlus,
      mdiStop,
      mdiThumbUp

    },
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: lightTheme,
      dark: darkTheme
    }
  }
})
