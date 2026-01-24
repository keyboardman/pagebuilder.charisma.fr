import { registerReactControllerComponents } from '@symfony/ux-react';
import '@hotwired/turbo';
import './styles/app.css';
import './bootstrap';

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));