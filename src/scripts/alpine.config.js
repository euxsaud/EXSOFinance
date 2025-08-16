// IMPORTS > Dependencies
import { da } from 'date-fns/locale';
import API from './API.js';

// Export main Alpine component
export default () => ({
	DATA: [],
	BKDATA: [],
	onwait: false,
	page: 'accounts',
	opts: {
		accounts: [],
		currencies: [],
		customCategories: [],
	},

	util_FormatCurrency(value) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: this.filter?.currency || 'USD',
			minimumFractionDigits: 2,
		}).format(value);
	},

	/**
	 * Form for adding new accounts
	 * This form is used to add new accounts to the configuration.
	 */
	account_editMode: false,
	account_fields: {
		value: '',
		provider: '',
		type: '',
		limit: null,
		currency: 'USD',
		bgColor: '#000000',
		textColor: '#FFFFFF',
	},

	async account_formSubmit() {
		const { value, provider, type, limit, currency, bgColor, textColor } = this.account_fields;
		const dataAccount = { value, provider, type, limit, currency, style: [bgColor, textColor] };
		this.onwait = true;

		if (this.account_editMode) {
			this.opts.accounts = this.opts.accounts.map((item) => {
				if (item.value === value) return dataAccount;
				return item;
			});
		} else {
			// Validate if the account already exists
			if (this.opts.accounts.some((item) => item.value === value)) {
				alert(`Account "${value}" already exists!`);
				this.onwait = false;
				return;
			}

			this.opts.accounts.push(dataAccount);
		}

		this.account_resetForm();
		this.onwait = false;
	},

	account_resetForm() {
		this.account_editMode = false;
		this.account_fields = {
			value: '',
			provider: '',
			type: '',
			limit: null,
			currency: 'USD',
			bgColor: '#000000',
			textColor: '#FFFFFF',
		};
	},

	account_delete(account) {
		const confir = confirm(`Are you sure you want to delete the account "${account.value}"?`);

		if (!confir) return;

		this.opts.accounts = this.opts.accounts.filter((item) => item.value !== account.value);
	},

	account_edit(account) {
		this.account_editMode = true;
		this.account_fields = { ...account, bgColor: account.style[0], textColor: account.style[1] };
	},

	/**
	 * Variables and Methods for managing custom categories
	 * This section allows users to add, edit, and delete custom categories.
	 */
	cat_editMode: false,
	cat_fields: {
		value: '',
		bgColor: '#000000',
		textColor: '#FFFFFF',
	},

	async cat_formSubmit() {
		const { id, value, bgColor, textColor } = this.cat_fields;
		const dataCustomcat = { id, value, style: [bgColor, textColor] };

		this.onwait = true;

		if (this.cat_editMode) {
			this.opts.customCategories = this.opts.customCategories.map((item) => {
				if (item.value === this.cat_fields.value) return dataCustomcat;
				return item;
			});
		} else {
			// Validate if the custom category already exists
			if (this.opts.customCategories.some((item) => item.value === this.cat_fields.value)) {
				alert(`Category "${this.cat_fields.value}" already exists!`);
				this.onwait = false;
				return;
			}

			this.opts.customCategories.push({
				...this.cat_fields,
				style: [this.cat_fields.bgColor, this.cat_fields.textColor],
			});
		}

		this.cat_resetForm();
		this.onwait = false;
	},

	cat_resetForm() {
		this.cat_editMode = false;
		this.cat_fields = {
			value: '',
			bgColor: '#000000',
			textColor: '#FFFFFF',
		};
	},

	cat_delete(category) {
		const confir = confirm(`Are you sure you want to delete the category "${category.value}"?`);

		if (!confir) return;

		this.opts.customCategories = this.opts.customCategories.filter((item) => item.value !== category.value);
	},

	cat_edit(category) {
		this.cat_editMode = true;
		this.cat_fields = { ...category, bgColor: category.style[0], textColor: category.style[1] };
	},

	async init() {
		console.log('Config component initialized');
		this.onwait = true;

		const GetOptions = await API('getOptions');
		this.opts.accounts = GetOptions.accounts;
		this.opts.currencies = GetOptions.currencies;

		// console.log('Received Categories:', GetOptions.categories);

		this.onwait = false;
	},
});
