// initialStates.js

export default {
  modalDlg () {
    return {
      show: false,
      title: '',
      text: '',
      cancelText: 'Cancel',
      confirmText: 'Ok',
      eventName: 'modalEvent'
    }
  },
  alert () {
    return {
      show: false,
      text: '',
      type: 'info',
      timeout: 5000
    }
  }
}
