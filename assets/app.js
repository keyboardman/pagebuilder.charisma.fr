import { registerReactControllerComponents } from '@symfony/ux-react';
import './stimulus_bootstrap.js';
        import './styles/app.css';
    import './bootstrap';

    registerReactControllerComponents(import.meta.webpackContext('./react/controllers', {
        recursive: true,
        regExp: /\.(j|t)sx?$/,
    }));

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));