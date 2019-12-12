import path from "path"
import commonJS from "rollup-plugin-commonjs"
import copy from 'rollup-plugin-copy'
import resolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import sass from 'rollup-plugin-scss'
import typescript from "rollup-plugin-typescript"

export default ["custom-apps/album-page", "extensions/album-page", "extensions/dark-mode", "themes/AlbumCentric"].map((entry, i) => ({
  input: `${ entry }/src/${ path.basename(entry) }.ts`,
  output: {
    file: entry.indexOf("extensions") == -1 ? `dist/${ entry }/${ path.basename(entry) }.js` : `dist/${ entry }.js`,
    name: path.basename(entry).replace("-","_"),
    format: "iife"
  },
  onwarn: (err) => { throw err },
  // external: [
  //   'react', 
  //   'react-dom'
  // ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    copy({
      targets: [
        { src: `${ entry }/src/static/**/*`, dest: `dist/${ entry }` }
      ]
    }),
    resolve(),
    commonJS({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    typescript({
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '../shared/src/**/*.ts+(|x)'],
      baseUrl: `./${ entry }`,
      tsconfig: `${ entry }/tsconfig.json`
    }),
    entry.indexOf("extensions") == -1 && sass({
      indentedSyntax: true,
      output: entry.indexOf("themes") == -1 ? `dist/${ entry }/style.css` : `dist/${ entry }/user.css`
    })
    // execute('s')
  ]
}))