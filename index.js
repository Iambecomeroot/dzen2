const spawn = require('child_process').spawn
const duplexify = require('duplexify')
const through = require('through2')

module.exports = function dzen2 (opts) {
  const args = serializeOptions(opts || {})

  const dz = spawn('dzen2', args)

  // Every `write()` call becomes a line.
  const input = through(function write (data, enc, cb) {
    const line = data.toString()
    cb(null, `${line}\n`)
  })
  input.pipe(dz.stdin)

  const stream = duplexify(input, dz.stdout)
  stream.process = dz
  stream.process.on('error', (error) => {
    stream.emit('error', error)
  })
  return stream
}

function serializeOptions (opts) {
  const args = []
  if (opts.foreground) {
    args.push('-fg', opts.foreground)
  }
  if (opts.background) {
    args.push('-bg', opts.background)
  }
  if (opts.font) {
    args.push('-fn', opts.font)
  }
  if (opts.align) {
    args.push('-ta', opts.align[0])
  }
  if (opts.titleWidth) {
    args.push('-tw', opts.titleWidth)
  }
  if (opts.secondaryAlign) {
    args.push('-sa', opts.secondaryAlign[0])
  }
  if (opts.secondaryLines) {
    args.push('-l', opts.secondaryLines)
  }
  if (opts.menu) {
    args.push('-m')
  }
  if (opts.updateSimultaneous) {
    args.push('-u')
  }
  if (opts.persist) {
    args.push('-p', opts.persist)
  }
  if (opts.x) {
    args.push('-x', opts.x)
  }
  if (opts.y) {
    args.push('-y', opts.y)
  }
  if (opts.lineHeight) {
    args.push('-h', opts.lineHeight)
  }
  if (opts.width) {
    args.push('-w', opts.width)
  }
  if (opts.screen) {
    args.push('-xs', opts.screen)
  }
  return args
}