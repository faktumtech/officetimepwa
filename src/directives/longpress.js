/**
 * Simple directive to catch click/touch vs long-click/long-touch
 */

// time in ms to count as long press
const longpressTime = 400
// check if we're using a touch screen
const isTouch = ('ontouchstart' in window)
// switch to touch events if using a touch screen
const startEvent = isTouch ? 'touchstart' : 'mousedown'
const stopEvent = isTouch ? 'touchend' : 'mouseup'

export default {
  beforeMount: function (el, binding) {
    let timeout = null
    const start = () => {
      if (timeout) {
        return
      }
      timeout = setTimeout(() => {
        timeout = null
        binding.value('long')
      }, longpressTime)
    }
    const stop = () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
        binding.value('short')
      }
    }
    el.__longpressHandlers__ = { start, stop }
    el.addEventListener(startEvent, start)
    el.addEventListener(stopEvent, stop)
  },
  unmounted: function (el) {
    const handlers = el.__longpressHandlers__
    if (!handlers) {
      return
    }
    el.removeEventListener(startEvent, handlers.start)
    el.removeEventListener(stopEvent, handlers.stop)
    delete el.__longpressHandlers__
  }
}
