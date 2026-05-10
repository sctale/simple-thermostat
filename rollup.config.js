import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import postCSS from 'rollup-plugin-postcss'
import postCSSLit from 'rollup-plugin-postcss-lit'
import postCSSPresetEnv from 'postcss-preset-env'
import inject from 'rollup-plugin-inject-process-env'
import terser from '@rollup/plugin-terser'

const production = process.env.NODE_ENV === 'production'

const shared = (debug) => [
  resolve({
    browser: true,
  }),
  commonjs(),
  json(),
  inject(
    {
      DEBUG: debug ? 'true' : 'false',
    },
    { exclude: '**/*.css' }
  ),
  typescript(),
  postCSS({
    plugins: [
      postCSSPresetEnv({
        stage: 1,
        features: {
          'nesting-rules': true,
        },
      }),
    ],
    inject: true,
    extract: false,
  }),
  postCSSLit(),
]

export default [
  {
    input: 'src/simple-thermostat.ts',
    output: {
      file: 'dist/simple-thermostat.js',
      format: 'es',
      name: 'SimpleThermostat',
    },
    plugins: [
      ...shared(false),
      production ? terser({ output: { comments: false } }) : null,
    ].filter(Boolean),
  },
  {
    input: 'src/simple-thermostat.ts',
    output: {
      file: 'dist/simple-thermostat.debug.js',
      format: 'es',
      name: 'SimpleThermostat',
    },
    plugins: shared(true),
  },
]
