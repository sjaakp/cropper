
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import {terser} from 'rollup-plugin-terser';
import {version} from './package.json';

const widgetName = 'Cropper';
const year = new Date().getFullYear();
const date = new Date().toDateString();

const banner = `
/*!
 * ${widgetName} ${version}
 * (c) ${year} sjaakpriester.nl
 */
`;

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/cropper.js',
        format: 'esm',
        name: widgetName,
        sourcemap: true,
        globals: {
        },
        banner: banner,
    },
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectories: ['node_modules']
            }
        }),
        commonjs(),
        json(),
        scss({
            insert: true,
            outputStyle: "compressed",
            // sourceMap: true
        }),
        terser({
            output: {
                comments: /^!/
            }
        })
    ],
    external: [
    ]
};
