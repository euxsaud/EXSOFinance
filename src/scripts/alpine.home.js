// IMPORT > Dependencies
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import API from './API.js';

//
export default () => ({
	DATA: [],
	BKDATA: [],
	onwait: false,
	options: {
		accounts: [],
		currencies: [],
		categories: [],
		transactions: [],
		groupedCategories: [],
	},

	/**
	 * Methods with "util_" prefix are utility functions
	 * that can be used across the component.
	 */

	// Method to format date (e.g., "Jan 01, 2023")
	util_FormatDate(date) {
		return format(parseISO(date), 'MMM dd, yyyy');
	},

	// Method to get the style options for a specific type
	util_getStyleOption(typeOption, value) {
		let option = this.options[typeOption];
		const defaultStyle = { backgroundColor: '#bdc3c7', color: '#34495e' };

		if (!option) return defaultStyle;

		option = option.find((opt) => opt.value.toLowerCase() === value.toLowerCase());

		return !option ? defaultStyle : { backgroundColor: option.style[0], color: option.style[1] };
	},

	/**
	 * Variables and Methods for managing filters.
	 * These are used to filter the displayed data based on user input.
	 */
	filter: {
		date: { from: null, to: null, formattedFrom: null, formattedTo: null },
		category: 'all',
		account: 'all',
		transaction: 'all',
		amount: 0,
		currency: 'USD',
		maxAmount: 500,
	},

	filter_Apply(event) {
		// Filter by date range
		if (event) {
			if (event.target.tagName.includes('CALENDAR-')) {
				const value = event.target.value;
				let [from, to] = value.split('/');
				this.filter.date.from = parseISO(from);
				this.filter.date.to = parseISO(to);
				this.filter.date.formattedFrom = format(this.filter.date.from, 'MMM dd, yyyy');
				this.filter.date.formattedTo = format(this.filter.date.to, 'MMM dd, yyyy');
			}
		}

		this.DATA = this.BKDATA.filter((item) => {
			const ItemDate = parseISO(item.date);
			const filterAmount = parseFloat(this.filter.amount);

			const byDaterange = isWithinInterval(ItemDate, { start: this.filter.date.from, end: this.filter.date.to });
			const byCategory = this.filter.category === 'all' || item.category.toLowerCase() === this.filter.category.toLowerCase();
			const byAccount = this.filter.account === 'all' || item.account.toLowerCase() === this.filter.account.toLowerCase();
			const byTransaction =
				this.filter.transaction === 'all' || item.transaction.toLowerCase() === this.filter.transaction.toLowerCase();
			const byAmount = filterAmount === 0 || filterAmount >= this.filter.maxAmount || item.amount <= filterAmount;
			const byCurrency = item.currency.toLowerCase() === this.filter.currency.toLowerCase();

			return byDaterange && byCategory && byAccount && byTransaction && byAmount && byCurrency;
		});
	},

	/**
	 * Variables and Methods for managing the main form to save a new record.
	 * This form is used to add new records to the DATA array.
	 */
	form_Modal: document.querySelector('#add_record_modal'),
	form_El: null,
	form_saveAndAddOther: false, // Flag to determine if the form should save and add another record
	form_editMode: false, // Flag to determine if the form is in edit mode
	form_fields: {
		date: format(new Date(), 'yyyy-MM-dd'), // Default to today's date
		category: '',
		payee: '',
		description: '',
		account: '',
		transaction: '',
		amount: null,
		currency: 'USD', // Default currency
	},

	form_Reset() {
		this.form_fields = {
			date: format(new Date(), 'yyyy-MM-dd'), // Reset to today's date
			category: '',
			payee: '',
			description: '',
			account: '',
			transaction: '',
			amount: null,
			currency: 'USD', // Reset to default currency
		};
	},

	form_Edit(record) {
		this.form_editMode = true; // Set edit mode to true
		this.form_fields = { ...record };
		this.form_Modal.showModal();
	},

	form_Delete(record) {
		const prompt = confirm(`Are you sure you want to delete the record with ID ${record.id}?`);

		if (prompt) {
			this.BKDATA = this.BKDATA.filter((item) => item.id !== record.id);
			this.DATA = this.BKDATA;
		}
	},

	form_Submit() {
		this.onwait = true;

		this.form_fields.amount = parseFloat(this.form_fields.amount);

		if (!this.form_saveAndAddOther) this.form_Modal.close();

		if (this.form_editMode) {
			// Update existing record
			const index = this.BKDATA.findIndex((item) => item.id === this.form_fields.id);
			if (index !== -1) {
				this.BKDATA[index] = { ...this.form_fields }; // Update the record
				this.BKDATA.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date
				this.DATA = this.BKDATA;
			}
			this.form_editMode = false; // Reset edit mode
		} else {
			const newRecord = { id: this.BKDATA.length + 1, ...this.form_fields };
			this.BKDATA.push(newRecord);
			this.BKDATA.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date
			this.DATA = this.BKDATA;
		}

		this.form_Reset();
		this.filter_Apply();

		this.onwait = false;
	},

	async init() {
		console.log('HOME component initialized');
		this.onwait = true;

		// Set current date range as default filter
		const today = new Date();
		this.filter.date.from = startOfMonth(today);
		this.filter.date.to = endOfMonth(today);
		this.filter.date.formattedFrom = format(this.filter.date.from, 'MMM dd, yyyy');
		this.filter.date.formattedTo = format(this.filter.date.to, 'MMM dd, yyyy');

		// Set values for form
		this.form_El = this.$refs.MainForm;

		// Set options for accounts, categories, transactions, and currencies
		const getOptions = await API('getOptions');
		this.options.accounts = getOptions.accounts;
		this.options.currencies = getOptions.currencies;
		this.options.categories = getOptions.categories;
		this.options.transactions = getOptions.transactions;
		this.options.groupedCategories = getOptions.groupedCategories;
		console.log(getOptions);

		const getRecords = await API('data');
		this.DATA = getRecords;
		this.BKDATA = getRecords;

		// Apply initial filter
		this.filter_Apply();

		this.onwait = false;
	},
});
