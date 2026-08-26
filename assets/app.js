import './stimulus_bootstrap.js';
    import { registerReactControllerComponents } from '@symfony/ux-react';
    import './styles/app.css';
    import './bootstrap';

    registerReactControllerComponents(import.meta.webpackContext('./react/controllers', {
        recursive: true,
        regExp: /\.(j|t)sx?$/,
    }));
