import terser from '@rollup/plugin-terser';

export default [
    {
        input: './node_modules/fflate/esm/browser.js',
        output: {
            dir: "./zip",
            format: 'es',
            plugins: [
                terser({
                    mangle: {
                        toplevel: true
                    },
                    compress: {
                        passes: 3,
                        pure_getters: true,
                        unsafe: true
                    },
                    format: {
                        comments: false
                    }
                })
            ]
        },
    },
   
];
