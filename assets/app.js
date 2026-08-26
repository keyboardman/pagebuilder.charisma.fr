import { registerReactControllerComponents } from '@symfony/ux-react';
import './stimulus_bootstrap.js';
import './styles/app.css';

registerReactControllerComponents(import.meta.webpackContext('./react/controllers', {
    recursive: true,
    regExp: /\.(j|t)sx?$/,
}));
