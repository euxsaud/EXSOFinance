import { ALPINE_KPIS } from './alpine.kpis';
import { ALPINE_THEME } from './alpine.theme';
import { ALPINE_RECORDS } from './alpine.records';
import { ALPINE_CONFIGS } from './alpine.configs';

document.addEventListener('alpine:init', () => {
	Alpine.data('KPIS', ALPINE_KPIS);
	Alpine.data('THEME', ALPINE_THEME);
	Alpine.data('HOME', ALPINE_RECORDS);
	Alpine.data('CONFIGS', ALPINE_CONFIGS);
});

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM fully loaded and parsed 🔥');
});
