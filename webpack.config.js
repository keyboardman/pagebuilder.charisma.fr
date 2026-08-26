import Encore from '@symfony/webpack-encore'
import path from 'path'
import sass from 'sass'

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev')
}

console.log('webpack.config.js', process.env.NODE_ENV || 'dev') //

Encore.setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .addEntry('ThemeForm2', './assets/ThemeForm2.tsx')


    // builder standalone
    .addEntry('pageBuilderStandalone', './assets/pageBuilderStandalone.jsx')
    // preview standalone
    .addEntry('pagePreview', './assets/pagePreview.jsx')
    .addEntry('videoPlayer', './assets/videoPlayer.js')
    
    .enableStimulusBridge('./assets/controllers.json')
    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enablePostCssLoader()
    .enableReactPreset()
    .enableTypeScriptLoader()
    .enableForkedTypeScriptTypesChecking()
    .enableSassLoader(options => {
        options.implementation = sass
    })

    .configureBabel((config) => {
        config.plugins.push(['polyfill-corejs3', { method: 'usage-global', version: '3.49' }])
        config.plugins.push('@babel/plugin-transform-class-properties')
    })
    .configureCssMinimizerPlugin((options, MinimizerPlugin) => {
        options.minify = MinimizerPlugin.cssnanoMinify
        options.minimizerOptions = {
            preset: ['default', { calc: false }]
        }
    })
;

const config = await Encore.getWebpackConfig()
config.watchOptions = config.watchOptions || {}
config.watchOptions.ignored = [
    ...(Array.isArray(config.watchOptions.ignored)
        ? config.watchOptions.ignored
        : []),
    '**/public/build/**'
]
// Polling pour macOS (fsevents peut ignorer certains changements)

config.watchOptions.poll = 1000
config.watchOptions.aggregateTimeout = 300
config.watchOptions.ignored = [
    ...(Array.isArray(config.watchOptions.ignored)
        ? config.watchOptions.ignored
        : []),
    '**/public/build/**'
]
config.resolve = config.resolve || {}
config.resolve.alias = {
    ...(config.resolve.alias || {}),
    '@': path.resolve(import.meta.dirname, 'assets'),
    '@editeur': path.resolve(import.meta.dirname, 'assets/editeur')
}

config.resolve.extensions = [
    ...(config.resolve.extensions || []),
    '.ts',
    '.tsx'
]

// Laisser les url() absolues vers public/ (ex. /assets/icons/*.svg) pour le navigateur, sans les résoudre au build.
config.module.rules.forEach((rule) => {
    if (!rule.oneOf) {
        return
    }
    rule.oneOf.forEach((oneOfRule) => {
        if (!oneOfRule.use) {
            return
        }
        oneOfRule.use.forEach((useEntry) => {
            const loader = typeof useEntry === 'object' ? useEntry.loader : ''
            if (
                typeof loader !== 'string'
                || !loader.includes('css-loader')
                || loader.includes('postcss-loader')
            ) {
                return
            }
            const options = useEntry.options || {}
            const previousUrl = options.url
            options.url = {
                filter: (url) => {
                    if (url.startsWith('/assets/')) {
                        return false
                    }
                    if (typeof previousUrl === 'object' && previousUrl !== null && typeof previousUrl.filter === 'function') {
                        return previousUrl.filter(url)
                    }
                    return true
                },
            }
            useEntry.options = options
        })
    })
})

export default config
