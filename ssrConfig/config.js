module.exports = {
    // prod
    mode: 'dev',
    devPort: 9000,
    // webpack chunk name
    injectScripts: [
        'runtime~index.file.js',
        'vendor.chunk.js',
        'index.chunk.js'
    ],
    // webpack css name
    injectCss: [
        'index.css'
    ],
    useLayout: true,
    buildOptions: {
        useParallel: true,
        debug: true
    },
    // stream res
    useStreamResponse: true,
    production: {
        urlPrefix: './'
    }
}