const { join } = require('path')
const { rollup } = require('rollup')
const minimist = require('minimist')

const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')

// current working directory & package.json for package
const cwd = process.cwd()
const pkgJSON = require(join(cwd, 'package.json'))

// may configure rollup in package.json with the key "rollup": {...}
const rollupConfig = pkgJSON.rollup
// const exampleRollupConfig = {
//   // list of globals
//   globals: {
//     jQuery: '$'
//   },
//   // lift of modules to exclude from the bundle
//   external: ['jQuery']
// }

const options = minimist(process.argv.slice(2), {
  boolean: ['uglify'],
  default: {
    env: 'development',
    format: 'umd',
    suffix: '',
    uglify: false
  }
})

// compute the plugins, later on based on options/command line args
const createPlugins = function() {
  const plugins = [
    // aliasPlugin(...),
    nodeResolve({
      extensions: ['.ts', '.js', '.json'],
      jsnext: true
    }),
    commonjs({ include: 'node_modules/**' }),
    typescript({
      tsconfig: '../../tsconfig.json',
      clean: true
    }),
    replace({ 'process.env.NODE_ENV': options.env })
  ]

  if (options.uglify) {
    plugins.push(uglify())
  }
  return plugins
}

rollup({
  input: join(cwd, 'src/index.ts'),
  // must explicitly add bundled dependencies in package.json
  external: rollupConfig.external || [],
  plugins: createPlugins()
})
  .then(bundle => {
    return bundle.write({
      file: `dist/${pkgJSON.name}${options.suffix}.js`,
      sourcemap: true,
      format: options.format,
      name: pkgJSON.name,
      globals: rollupConfig.globals || {}
    })
  })
  .then(() => {
    console.info(`Build of ${pkgJSON.name} in ${options.format} SUCCESS`)
  })
  .catch(error => {
    console.error(`Build of ${pkgJSON.name} in ${options.format} FAILED: ${error.message}`)
    console.error(error)
    exit(-1)
  })
