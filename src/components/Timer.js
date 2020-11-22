// timer.js

import store from '@/store'

// timer shared between instances of module
var timer
var audioContext

export default {
  /**
   * start timer run and persist timerCount regularily
   * @param {Number} timerId
   * @param {Number} initialTimerCount // elapsed time in seconds
   * @param {Number} timerRate // rate
   * @return {undefined}
  */
  start: function (timerId, initialTimerCount, timerRate) {
    this.sound()

    // clear any active timer
    if (timer) {
      clearInterval(timer)
    }
    store.commit('timerSessionId', timerId)
    store.commit('timerStatus', 'running')
    store.commit('timerOffset', 0)

    // use exact time instead of timer interval to measure the elapsed time
    const start = new Date().getTime()

    // start timer and update timerCount on each cycle
    timer = setInterval(async () => {
      const now = new Date().getTime()
      // the timerOffset can be manipulated by other components during a timer run
      const timerOffset = store.state.timerOffset
      const timerCount = Math.floor((now - start + timerOffset * 60000 + initialTimerCount * 60000) / 60000)
      const amount = Math.round(((timerCount * timerRate / 60) + 0.00001) * 100) / 100
      // console.log('timer', timerOffset, timerCount)
      store.commit('timerCount', timerCount)
      const payload = { id: timerId, changes: { t: timerCount, a: amount } }
      await store.dispatch('updateSession', payload)
    }, 1000)
  },
  stop: function () {
    if (store.state.timerStatus !== 'stopped') {
      this.sound()
      clearInterval(timer)
      store.commit('timerSessionId', false)
      store.commit('timerCount', 0)
      store.commit('timerStatus', 'stopped')
    }
  },
  pause: function () {
    this.sound()
    clearInterval(timer)
    // don't reset timerSessionId and timerCount
    store.commit('timerStatus', 'paused')
  },
  sound: function () {
    // use of web audio api
    // https://stackoverflow.com/questions/29567580/play-a-beep-sound-on-button-click
    const shortBeep = () => {
      var frequency = 500 // hz
      var duration = 100 // ms
      var vol = 100 // %

      var myOscillator = audioContext.createOscillator()
      var myGain = audioContext.createGain()
      myOscillator.connect(myGain)
      myOscillator.frequency.value = frequency
      myOscillator.type = 'square'
      myGain.connect(audioContext.destination)
      myGain.gain.value = vol * 0.01
      myOscillator.start(audioContext.currentTime)
      myOscillator.stop(audioContext.currentTime + duration * 0.001)
    }

    if (store.state.audioApi && store.getters.getSetting('sound')) {
      // audioContext is started as suspended in IOS and can
      // only be resumed by explicit user action
      // use start click to resume audioContest and beep once
      try {
        if (!audioContext) {
          audioContext = new window.AudioContext()
        }
        if (audioContext.state === 'running') {
          shortBeep()
        } else if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            shortBeep()
          })
        } else {
          console.error(audioContext.state)
        }
      } catch (err) {
        console.error(err)
        store.commit('alert',
          {
            show: true,
            text: err,
            type: 'info'
          }
        )
      }
    }
  }
}
