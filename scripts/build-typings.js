'use strict'

const dts = require('dts-bundle')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const cwd = process.cwd()
const pkgJSON = require(path.join(cwd, 'package.json'))

if (pkgJSON.private) {
  return
}

try {
  dts.bundle({
    main: `dist/packages/${pkgJSON.name}/src/index.d.ts`,
    baseDir: 'dist',
    name: pkgJSON.name,
    out: `./${pkgJSON.name}.d.ts`
  })
  console.log(`${pkgJSON.name} in typings is DONE`)

  // delete temporary folder holding the typings
  rimraf.sync('dist/packages')
} catch (e) {
  throw Error(e)
}
