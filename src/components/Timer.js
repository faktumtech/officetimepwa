// timer.js

import store from '@/store'
import Utils from '@/utils/Utils'

// timer shared between instances of module
let timer
let audioContext

// state of the current timer run
let timerId = null
let start = 0 // ms timestamp of the run start
let initialTimerCount = 0 // minutes already counted when the run started
let timerRate = 0

/**
 * minutes elapsed since the start of the run (incl. the initial count),
 * as a float, without the manual offset
 * @return {Number}
 */
function elapsedMinutes () {
  return (Date.now() - start) / 60000 + initialTimerCount
}

/**
 * compute the current timer count and persist it on the session
 * @return {Promise} undefined
 */
async function tick () {
  // the timerOffset can be manipulated by other components during a timer run
  const timerCount = Math.floor(elapsedMinutes() + store.state.timerOffset)
  const amount = Utils.round(timerRate * timerCount / 60, 2)
  store.commit('timerCount', timerCount)
  const payload = { id: timerId, changes: { t: timerCount, a: amount } }
  await store.dispatch('updateSession', payload)
}

export default {
  /**
   * start timer run and persist timerCount regularily
   * @param {Number} id
   * @param {Number} initialCount // elapsed time in minutes
   * @param {Number} rate // rate
   * @return {undefined}
  */
  start: function (id, initialCount, rate) {
    this.sound()

    // clear any active timer
    if (timer) {
      clearInterval(timer)
    }
    timerId = id
    initialTimerCount = initialCount
    timerRate = rate
    // use exact time instead of timer interval to measure the elapsed time
    start = Date.now()

    store.commit('timerSessionId', timerId)
    store.commit('timerStatus', 'running')
    store.commit('timerOffset', 0)

    // start timer and update timerCount on each cycle
    timer = setInterval(tick, 1000)
  },
  /**
   * set the running timer to an absolute minute value.
   * The run clock is restarted at that value, so the seconds are reset to 0
   * and the next minute step happens exactly 60s after the manual change.
   * Fast consecutive inputs don't accumulate: each call simply re-anchors
   * the clock at the given value.
   * @param {Number} minutes
   * @return {Promise} undefined
   */
  setCount: function (minutes) {
    if (store.state.timerStatus !== 'running') {
      return
    }
    start = Date.now()
    initialTimerCount = minutes
    store.commit('timerOffset', 0)
    // reflect the change immediately instead of waiting for the next cycle
    return tick()
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
      const frequency = 500 // hz
      const duration = 100 // ms
      const vol = 100 // %

      const myOscillator = audioContext.createOscillator()
      const myGain = audioContext.createGain()
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
