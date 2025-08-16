// IMPORT > Dependencies
import Alpine from 'alpinejs';
import mask from '@alpinejs/mask';
import 'cally';
import './style.css';
// Import Alpine components
import ALPINE_HOME from './scripts/alpine.home.js';
import ALPINE_KPIS from './scripts/alpine.kpis.js';
import ALPINE_CONFIGS from './scripts/alpine.config.js';

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.plugin(mask);

document.addEventListener('alpine:init', () => {
	Alpine.data('HOME', ALPINE_HOME);
	Alpine.data('KPIS', ALPINE_KPIS);
	Alpine.data('CONFIGS', ALPINE_CONFIGS);
});

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM fully loaded and parsed');

	Alpine.start();
});
