/**
 * Simple directive to catch click/touch vs long-click/long-touch
 */

var binding
var timeout
var longpressTime = 400 // time in ms to count as long press

function start () {
  cancel()
  timeout = setTimeout(function () {
    binding.value('long')
    timeout = false
  }, longpressTime)
}

function stop () {
  if (timeout) {
    binding.value('short')
  }
  cancel()
}

function cancel () {
  if (timeout) {
    clearTimeout(timeout)
    timeout = false
  }
}

export default {
  bind: function (el, _binding) {
    binding = _binding

    el.addEventListener('touchstart', start)
    el.addEventListener('touchcancel', cancel)
    el.addEventListener('touchend', stop)
    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', stop)
  },
  unbind: function (el) {
    el.removeEventListener('touchstart', start)
    el.removeEventListener('touchcancel', stop)
    el.removeEventListener('touchend', stop)
    el.removeEventListener('mousedown', start)
    el.removeEventListener('mouseup', stop)
  }
}
