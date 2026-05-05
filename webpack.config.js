const Encore = require('@symfony/webpack-encore')
const path = require('path')

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev')
}

console.log('webpack.config.js', process.env.NODE_ENV || 'dev') //

Encore.setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .addEntry('themeForm', './assets/themeForm.jsx')
    .addEntry('ThemeForm2', './assets/ThemeForm2.tsx')


    // builder standalone
    .addEntry('pageBuilderStandalone', './assets/pageBuilderStandalone.jsx')
    // preview standalone
    .addEntry('pagePreview', './assets/pagePreview.jsx')
    
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
        options.implementation = require('sass');
    })
    

    .configureBabel(config => {
        config.plugins.push('@babel/plugin-transform-class-properties')
    })
    .configureBabelPresetEnv(config => {
        config.useBuiltIns = 'usage'
        config.corejs = 3
    })
    .configureCssMinimizerPlugin(options => {
        options.minimizerOptions = {
            preset: ['default', { calc: false }]
        }
    })
;

const config = Encore.getWebpackConfig()
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
    '@': path.resolve(__dirname, 'assets'),
    '@editeur': path.resolve(__dirname, 'assets/editeur2')
}

config.resolve.extensions = [
    ...(config.resolve.extensions || []),
    '.ts',
    '.tsx'
]
module.exports = config
