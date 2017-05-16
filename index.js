const Transform = require('stream').Transform

class ReplaceStream extends Transform {
  constructor (matcher, replacement, options) {
    super(options)

    this.matcher = Buffer.from(matcher)
    this.replacement = Buffer.from(replacement)
    this.chunksLength = 0
    this.chunks = []
    this.counter = 0
  }

  _transform (chunk, encoding, done) {
    this.chunks.push(chunk)
    this.chunksLength += chunk.length

    const segment = Buffer.concat(this.chunks, this.chunksLength)
    const remainder = this.pushWithReplacements(segment)

    this.chunks = [remainder]
    this.chunksLength = remainder.length

    done()
  }

  _flush (done) {
    if (this.chunks.length > 0) {
      this.push(Buffer.concat(this.chunks, this.chunksLength))
      this.chunks = []
      this.chunksLength = 0
      done()
    }
  }

  pushWithReplacements (src) {
    const fn = i => {
      const start = src.indexOf(this.matcher, i)

      if (start === -1) {
        let remainder = src.slice(i)

        if (remainder.length > this.replacement.length) {
          this.push(
            remainder.slice(0, remainder.length - this.replacement.length)
          )
          remainder = remainder.slice(
            remainder.length - this.replacement.length
          )
        }

        return remainder
      }

      this.push(Buffer.concat([src.slice(i, start), this.replacement]))

      return fn(start + this.matcher.length)
    }

    return fn(0)
  }
}

module.exports = (matcher, replacement, options) =>
  new ReplaceStream(matcher, replacement, options)
