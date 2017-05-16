const test = require('tape')
const buffers = require('stream-buffers')
const replace = require('../index')

test('replaces a string', t => {
  t.plan(1)

  const input = new buffers.ReadableStreamBuffer()
  const output = new buffers.WritableStreamBuffer()

  input.put('Lorem ipsum dolor sit amet')
  input.pipe(replace('ipsum', 'REPLACED')).pipe(output).on('finish', () => {
    t.equal(output.getContentsAsString('utf8'), 'Lorem REPLACED dolor sit amet')
  })
  input.stop()
})

test('replaces a string multiple times', t => {
  t.plan(1)

  const input = new buffers.ReadableStreamBuffer()
  const output = new buffers.WritableStreamBuffer()

  input.pipe(replace('ipsum', 'REPLACED')).pipe(output).on('finish', () => {
    t.equal(
      output.getContentsAsString('utf8'),
      'Lorem REPLACED dolor REPLACED sit amet REPLACED'
    )
  })
  input.put('Lorem ipsum dolor ipsum sit amet ipsum')
  input.stop()
})

test('replaces a string on a chunk boundary', t => {
  t.plan(1)

  const input = new buffers.ReadableStreamBuffer({ chunkSize: 7 })
  const output = new buffers.WritableStreamBuffer()

  input.pipe(replace('ipsum', 'REPLACED')).pipe(output).on('finish', () => {
    t.equal(
      output.getContentsAsString('utf8'),
      'Lorem REPLACED dolor REPLACED sit REPLACED'
    )
  })
  input.put('Lorem ipsum dolor ipsum sit ipsum')
  input.stop()
})

test('replaces a string when replacement is longer than a single chunk', t => {
  t.plan(1)

  const input = new buffers.ReadableStreamBuffer({ chunkSize: 3 })
  const output = new buffers.WritableStreamBuffer()

  input.pipe(replace('andy', 'nick')).pipe(output).on('finish', () => {
    t.equal(
      output.getContentsAsString('utf8'),
      'hello nick hello nick hello nick'
    )
  })
  input.put('hello andy hello andy hello andy')
  input.stop()
})
