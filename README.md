# stream-buffer-replace-up [![Build Status](https://travis-ci.org/joseluisq/stream-buffer-replace-up.svg?branch=master)](https://travis-ci.org/joseluisq/stream-buffer-replace-up)

> Efficient streaming find and replace. Buffer based and boundary aware.

__Note:__ This repository is an updated fork (__Node >= 6__) from [stream-buffer-replace](https://github.com/neonadventures/stream-buffer-replace).

```
yarn add stream-buffer-replace-up
```

## Advantages

- Never converts Buffers to strings.
- Only supports exact matching not patterns / regexs.
- Finds matches that span chunk boundaries.
- Finds matches that are bigger than a single chunk.

## Usage

Example using strings:

```js
const fs = require('fs')
const replace = require('stream-buffer-replace-up')

fs.writeFileSync('example.txt', 'hello world')

const stream = fs.createReadStream('example.txt')
stream
  .pipe(replace('hello', 'goodbye'))
  .pipe(process.stdout);

// => goodbye world
```

Example using buffers:

```js
const fs = require('fs');
const replace = require('stream-buffer-replace-up')

fs.writeFileSync('example.txt', 'hello world')

const stream = fs.createReadStream('example.txt')
const replacer = replace(Buffer.from('hello'), Buffer.from('goodbye'))

stream
  .pipe(replace(
    Buffer.from('hello'),
    Buffer.from('goodbye')
  ))
  .pipe(process.stdout)

// => goodbye world
```

## Tests

```
yarn
yarn test
```

Contributions welcome.
