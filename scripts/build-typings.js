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
    main: 'dist/index.d.ts',
    baseDir: 'dist',
    name: pkgJSON.name,
    out: `./${pkgJSON.name}.d.ts`
  })
  console.log(`${pkgJSON.name} in typings is DONE`)

  fs.readdirSync(path.join(cwd, 'dist')).forEach(file => {
    const isDtsFile = file.endsWith('.d.ts')
    const isOutputFile = file.endsWith(pkgJSON.name + '.d.ts')
    const isFolder = !file.includes('.')
    if (isFolder || (isDtsFile && !isOutputFile)) {
      console.log('Deleting dist/' + file)
      rimraf.sync(path.join('dist', file))
    }
  })
} catch (e) {
  throw Error(e)
}
