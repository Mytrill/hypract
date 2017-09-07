const { join } = require('path')
const { rollup } = require('rollup')
const minimist = require('minimist')

const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const analyze = require('rollup-analyzer-plugin')

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
    commonjs(),
    babel({
      // pass in the options here with babelrc = false to compile preact (which has the babel configuration in its package.json...)
      babelrc: false,
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              react: 'preact-compat',
              'react-dom': 'preact-compat',
              lodash: 'lodash-es'
            }
          }
        ],
        'external-helpers'
      ],
      presets: [
        [
          'es2015',
          {
            modules: false
          }
        ]
      ]
    }),
    replace({ 'process.env.NODE_ENV': options.env })
  ]

  if (options.uglify) {
    plugins.push(uglify())
  }

  // disable for now
  // plugins.push(analyze({ limit: 10 }))

  return plugins
}

rollup({
  input: join(cwd, 'lib-es/index.js'),
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
  })
