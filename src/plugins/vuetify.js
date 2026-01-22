import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi-svg'

// basic icons used by vuetify
// according vuetify/packages/vuetify/src/services/icons/presets/mdi.ts
import {
  mdiCheck,
  mdiCloseCircle,
  mdiClose,
  mdiCheckCircle,
  mdiInformation,
  mdiExclamation,
  mdiAlert,
  mdiChevronLeft,
  mdiChevronRight,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBox,
  mdiCircle,
  mdiArrowUp,
  mdiChevronDown,
  mdiMenu,
  mdiMenuDown,
  mdiRadioboxMarked,
  mdiRadioboxBlank,
  mdiPencil,
  mdiStarOutline,
  mdiStar,
  mdiStarHalfFull,
  mdiCached,
  mdiPageFirst,
  mdiPageLast,
  mdiUnfoldMoreHorizontal,
  mdiPaperclip,
  mdiPlus,
  mdiMinus
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
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...mdiAliases,
      complete: mdiCheck,
      cancel: mdiCloseCircle,
      close: mdiClose,
      delete: mdiCloseCircle,
      clear: mdiClose,
      success: mdiCheckCircle,
      info: mdiInformation,
      warning: mdiExclamation,
      error: mdiAlert,
      prev: mdiChevronLeft,
      next: mdiChevronRight,
      checkboxOn: mdiCheckboxMarked,
      checkboxOff: mdiCheckboxBlankOutline,
      checkboxIndeterminate: mdiMinusBox,
      delimiter: mdiCircle,
      sort: mdiArrowUp,
      expand: mdiChevronDown,
      menu: mdiMenu,
      subgroup: mdiMenuDown,
      dropdown: mdiMenuDown,
      radioOn: mdiRadioboxMarked,
      radioOff: mdiRadioboxBlank,
      edit: mdiPencil,
      ratingEmpty: mdiStarOutline,
      ratingFull: mdiStar,
      ratingHalf: mdiStarHalfFull,
      loading: mdiCached,
      first: mdiPageFirst,
      last: mdiPageLast,
      unfold: mdiUnfoldMoreHorizontal,
      file: mdiPaperclip,
      plus: mdiPlus,
      minus: mdiMinus
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
