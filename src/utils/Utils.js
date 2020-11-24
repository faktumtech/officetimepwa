// src/utils/Utils.js

const round = (val, _digits) => {
  const digits = _digits || 0
  const x = Math.pow(10, digits)
  return Math.round((+val + 0.001 / x) * x) / x
}

export default {

  /**
   * format date to ISO dateTime string ("yyyy-MM-ddThh:mm:ss")
   * elimnating the timezone offset
   * https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
   * @param {Date} date
   * @return {String} dateTimeStr
  */
  formatDateToLocalDateTimeIsoStr: (date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const dateTimeStr = (new Date(date - tzoffset)).toISOString().slice(0, -5)
    return dateTimeStr
  },

  /**
   * format date to ISO dateTime string ("yyyy-MM-dd")
   * elimnating the timezone offset
   * https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
   * @param {Date} date
   * @return {String} dateStr
  */
  formatDateToLocalDateIsoStr: (date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    return (new Date(date - tzoffset)).toISOString().slice(0, -14)
  },

  /**
   * format time in minutes to hh:mm string
   * @param {Number} time
   * @return {String} timeStr
  */
  formatTime: function (time) {
    const hours = Math.floor(time / 60)
    const minutes = time - hours * 60
    return '' + hours + ':' + ('0' + minutes).slice(-2)
  },

  /**
   * format date to local numeric format
   * eg: 20/11/2020 18:20 or 11-20-2020 6:20PM
   * @param {Number} time
   * @return {String} timeStr
  */
  formatDate: function (date) {
    return new Date(date).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  },

  /**
   * format Number or String of numbers
   * to rounded number with two decimals
   * @param {Number||String} amount
   * @return {String} formatedAmount
  */
  formatAmount: function (amount, digits) {
    return round(amount, digits).toFixed(digits)
  },

  /**
   * format Number or String of numbers
   * to rounded number with two decimals
   * @param {Number||String} amount
   * @return {String} formatedAmount
  */
  round: function (amount, digits) {
    return round(amount, digits)
  },

  // parse routines for importer
  parseIgnore: () => { return null },
  parseNum: (val) => { return round(+('' + val || 0).replace(',', '.'), 2) },
  parseMinutes: (val) => { return round(+('' + val || 0).replace(',', '.'), 0) },
  parseHours: (val) => { return round(60 * +('' + val || 0).replace(',', '.'), 0) },
  parseText: (val) => { return ('' + val).trim() },

  /**
   * parse "dd/MM/yyyy hh:mm" string to date
   * @param {Array} dateString
   * @return {Date} parsed Date
  */
  parseDateStr: (dateString) => {
    const d = dateString.split(' ')
    const date = d[0].split('/')
    const time = d[1].split(':')
    const dd = +date[0]
    const mm = +date[1]
    const yyyy = +date[2]
    const hh = +time[0]
    const min = +time[1]
    return new Date(yyyy, mm - 1, dd, hh, min)
  },
  /**
   * parse ISO date string ("yyyy-MM-ddThh:mm") to date
   * @param {Array} dateString
   * @return {Date} parsed Date
  */
  parseISODateStr: (dateString) => {
    return new Date(dateString)
  }
}
