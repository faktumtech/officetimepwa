// src/mixins/Utils.js

const round2 = (val) => { return Math.round((+val + 0.00001) * 100) / 100 }

export default {

  getLocalDateTimeStr: (date) => {
    // local date string in format "yyyy-MM-dd"
    // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
    const tzoffset = (date).getTimezoneOffset() * 60000 // offset in milliseconds
    return (new Date(date - tzoffset)).toISOString().slice(0, -5)
  },
  getLocalDateStr: (date) => {
    // local date string in format "yyyy-MM-dd"
    // https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
    const tzoffset = (date).getTimezoneOffset() * 60000 // offset in milliseconds
    return (new Date(date - tzoffset)).toISOString().slice(0, -14)
  },
  // parse routines
  parseIgnore: () => { return null },
  parseNum: (val) => { return round2(+('' + val || 0).replace(',', '.')) },
  parseNumMulti60: (val) => { return round2(60 * +('' + val || 0).replace(',', '.')) },
  parseText: (val) => { return ('' + val).trim() },
  round2: (val) => { return round2(val) }
}
