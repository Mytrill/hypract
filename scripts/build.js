const { join, resolve } = require('path')
const { rollup } = require('rollup')
const minimist = require('minimist')

const alias = require('rollup-plugin-alias')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const typescript = require('rollup-plugin-typescript2')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const analyze = require('rollup-analyzer-plugin')

// current working directory & package.json for package
const cwd = process.cwd()
const pkgJSON = require(join(cwd, 'package.json'))
const ROOT = join(cwd, '../../')

// may configure rollup in package.json with the key "rollup": {...}
const rollupConfig = pkgJSON.rollup

const options = minimist(process.argv.slice(2), {
  boolean: ['uglify', 'babel'],
  default: {
    env: 'development',
    format: 'umd',
    suffix: '',
    babel: true,
    uglify: false
  }
})

// compute the plugins, later on based on options/command line args
const getPlugins = function() {
  const plugins = [
    alias({
      // usage with preact
      react: resolve(cwd, 'node_modules/preact-compat/dist/preact-compat.es.js'),
      'react-dom': resolve(cwd, 'node_modules/preact-compat/dist/preact-compat.es.js'),
      'create-react-class': resolve(cwd, 'node_modules/preact-compat/lib/create-react-class.js'),
      // hypract libraries
      hypract: resolve(ROOT, 'packages/hypract/dist/hypract.es.js')
    }),
    nodeResolve({
      extensions: ['.ts', '.js', '.json'],
      jsnext: true
    }),
    commonjs(),
    typescript({
      tsconfig: '../../tsconfig.json',
      clean: true,
      // needed, otherwise the module resolution fails...
      check: false,
      exclude: ['*.d.ts', '**/*.d.ts', '*.test.*', '**/*.test.*']
    })
  ]

  if (options.babel) {
    plugins.push(
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
      })
    )
  }

  plugins.push(replace({ 'process.env.NODE_ENV': options.env }))

  if (options.uglify) {
    plugins.push(uglify())
  }

  // disable for now
  // plugins.push(analyze({ limit: 10 }))

  return plugins
}

const getExternals = () => {
  if (options.format === 'es') {
    return rollupConfig.esExternals || []
  }
  return rollupConfig.umdExternals || []
}

rollup({
  input: join(cwd, 'src/index.ts'),
  // must explicitly add bundled dependencies in package.json
  external: getExternals(),
  plugins: getPlugins()
})
  .then(bundle => {
    return bundle.write({
      file: `dist/${pkgJSON.name}${options.suffix}.js`,
      sourcemap: true,
      format: options.format,
      name: pkgJSON.name,
      globals: rollupConfig.umdGlobals || {}
    })
  })
  .then(() => {
    console.info(`Build of ${pkgJSON.name} in format ${options.format} SUCCEEDED`)
  })
  .catch(error => {
    console.error(`Build of ${pkgJSON.name} in format ${options.format} FAILED: ${error.message}`)
    console.error(error)
  })
