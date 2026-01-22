const listeners = new Map()

const on = (event, handler) => {
  if (!listeners.has(event)) {
    listeners.set(event, new Set())
  }
  listeners.get(event).add(handler)
}

const off = (event, handler) => {
  if (!listeners.has(event)) {
    return
  }
  if (!handler) {
    listeners.delete(event)
    return
  }
  const handlers = listeners.get(event)
  handlers.delete(handler)
  if (handlers.size === 0) {
    listeners.delete(event)
  }
}

const emit = (event, payload) => {
  const handlers = listeners.get(event)
  if (!handlers) {
    return
  }
  handlers.forEach((handler) => handler(payload))
}

export default {
  $on: on,
  $off: off,
  $emit: emit
}
