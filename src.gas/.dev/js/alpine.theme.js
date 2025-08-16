import { API } from './API.js';
import { notyf } from './notyf.js';

export const ALPINE_THEME = () => ({
	theme: document.body.getAttribute('data-theme'),

	async toggleTheme() {
		this.theme = this.theme === 'lightgreen' ? 'dark' : 'lightgreen';

		document.body.setAttribute('data-theme', this.theme);

		const SetTheme = await API.userSession('set', 'theme', this.theme);
		console.log(SetTheme);
		notyf[SetTheme.ok ? 'success' : 'error'](SetTheme.message);
	},

	init() {
		console.log('THEME component initialized');
	},
});
