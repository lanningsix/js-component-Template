import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import json from 'rollup-plugin-json';
import postcss from 'rollup-plugin-postcss';
const name = 'js-component-template'

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

export default {
  input: './src/index.ts',
  external: [],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({ extensions, include: ['src/**/*'] }),
    json(),
    terser(),
    // 新增的postcss
    postcss({
      extensions: ['.css']
    })
  ],

  output: [
    {
      file: 'dist/common-login-jssdk.js',
      format: 'esm',
    },
    // umd – 通用模块定义，以amd，cjs 和 iife 为一体
    {
      name: name,
      file: `dist/common-login-jssdk.umd.js`,
      format: 'umd'
    },


    // es – 将软件包保存为ES模块文件
    {
      name: name,
      file: `dist/common-login-jssdk.es.js`,
      format: 'es'
    },


    // cjs – CommonJS，适用于 Node 和 Browserify/Webpack
    {
      name: name,
      file: `dist/common-login-jssdk.cjs.js`,
      format: 'cjs'
    },


    // 异步模块定义，用于像RequireJS这样的模块加载器
    {
      name: name,
      file: `dist/common-login-jssdk.amd.js`,
      format: 'amd'
    }
  ]
}
