
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import css from "rollup-plugin-import-css";
import {terser} from 'rollup-plugin-terser';

const widgetName = 'Cropper';
const year = new Date().getFullYear();
const date = new Date().toDateString();

const banner = `
/*!
 * ${widgetName} 2.1.1
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
        css({
            inject: true,
            minify: true
        }),
        terser({
            mangle: {
                keep_fnames: true
            },
            format: {
                comments: /^!/
            }
        })
    ],
};
