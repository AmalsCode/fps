var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')

module.exports = fps

// Try use performance.now(), otherwise try
// require('microtime') or +new Date.
var now = (
  (function(){ return this }()).performance &&
  'function' === typeof performance.now
) ? function() { return performance.now() }
  : function() { return +new Date }

function fps(opts) {
  if (!(this instanceof fps)) return new fps(opts)
  EventEmitter.call(this)

  opts = opts || {}
  this.last = now()
  this.rate = 0
  this.decay = opts.decay || 1
  this.every = opts.every || 1
  this.ticks = 0
}
inherits(fps, EventEmitter)

fps.prototype.tick = function() {
  var time = now()
    , diff = time - this.last
    , fps = 1000 / diff

  this.ticks += 1
  this.last = time
  this.rate = this.rate + (fps - this.rate) * this.decay
  if (!(this.ticks % this.every)) this.emit('data', this.rate)
}

