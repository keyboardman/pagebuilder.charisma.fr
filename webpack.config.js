const Encore = require('@symfony/webpack-encore');
const path = require('path');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .addEntry('dashboard', './assets/dashboard.jsx')
    .addEntry('themeForm', './assets/themeForm.jsx')
    .addEntry('themeForm2', './assets/themeForm2.tsx')
    .addEntry('fileManager', './assets/fileManager.jsx')
    .addEntry('pageForm', './assets/pageForm.jsx')
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
  
    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-transform-class-properties');
    })
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })
;

const config = Encore.getWebpackConfig();
config.resolve = config.resolve || {};
config.resolve.alias = { ...(config.resolve.alias || {}), '@': path.resolve(__dirname, 'assets') };
config.resolve.extensions = [...(config.resolve.extensions || []), '.ts', '.tsx'];
module.exports = config;
