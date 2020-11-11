import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import IconLogo from '@/components/IconLogo'

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

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'svgMdi',
    // iconfont: 'mdi',
    values: {
      // own logo
      logo: {
        component: IconLogo
      },
      // basic icons used by vuetify
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
    }
  },
  theme: {
    dark: true,
    themes: {
      light: {
        // unofficial properties (has to be used through styles)
        // eg: :style="{ background: $vuetify.theme.themes[dark?'dark':'light'].background }"
        // background: '#333333,

        // official properties
        primary: '#2196f3' // default
      },
      dark: {
        // official properties
        primary: '#2196f3' // default
      }
    }
  }
})
