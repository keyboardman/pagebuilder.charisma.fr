import { startStimulusApp } from '@symfony/stimulus-bridge';

export const app = startStimulusApp(
    import.meta.webpackContext('./controllers', {
        recursive: true,
        regExp: /\.(j|t)sx?$/,
    })
);
