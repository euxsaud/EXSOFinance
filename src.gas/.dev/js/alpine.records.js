import { API } from './API.js';
import { notyf } from './notyf.js';

export const ALPINE_RECORDS = () => ({
	DATA: [],
	BKDATA: [],
	onwait: false,
	opts: {
		accounts: [],
		currencies: [],
		categories: [],
		transactions: [],
		groupedCategories: [],
	},

	// Method to format date (e.g., "Jan 01, 202X")
	util_FormatDate(date) {
		return dateFns.format(dateFns.parseISO(date), 'MMM dd, yyyy');
	},

	// Method to get the style options for a specific type
	util_getStyleOption(typeOption, value) {
		let option = this.opts[typeOption];
		const defaultStyle = { backgroundColor: '#bdc3c7', color: '#34495e' };

		if (!option) return defaultStyle;

		option = option.find((opt) => opt.value.toLowerCase() === value.toLowerCase());

		return !option ? defaultStyle : { backgroundColor: option.style[0], color: option.style[1] };
	},

	/**
	 * Variables and Methods to managing filters
	 * These are used to filter DATA
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
		if (event) {
			const value = event.target.value;
			if (event.target.tagName.includes('CALENDAR-')) {
				const [from, to] = value.split('/');
				this.filter.date.to = dateFns.parseISO(to);
				this.filter.date.from = dateFns.parseISO(from);
				this.filter.date.formattedTo = dateFns.format(this.filter.date.to, 'MMM dd, yyyy');
				this.filter.date.formattedFrom = dateFns.format(this.filter.date.from, 'MMM dd, yyyy');
			}
		}

		this.DATA = this.BKDATA.filter((item) => {
			const itemDate = dateFns.parseISO(item.date);
			const filterAmount = parseFloat(this.filter.amount);

			const byDaterange = dateFns.isWithinInterval(itemDate, { start: this.filter.date.from, end: this.filter.date.to });
			const byAccount = this.filter.account === 'all' || item.account.toLowerCase() === this.filter.account.toLowerCase();
			const byCategory = this.filter.category === 'all' || item.category.toLowerCase() === this.filter.category.toLowerCase();
			const byTransaction =
				this.filter.transaction === 'all' || item.transaction.toLowerCase() === this.filter.transaction.toLowerCase();
			const byAmount = filterAmount === 0 || filterAmount >= this.filter.maxAmount || item.amount <= filterAmount;
			const byCurrency = item.currency.toLowerCase() === this.filter.currency.toLowerCase();

			return byDaterange && byCategory && byAccount && byTransaction && byAmount && byCurrency;
		});
	},

	/**
	 * Variables and Methods for managing the main form to save a new record.
	 * This form is used to add new records to the SpreadSheet
	 */
	form_Modal: document.querySelector('#add_record_modal'),
	form_El: null,
	form_saveAndAddOther: false,
	form_editMode: false,
	form_fields: {
		date: dateFns.format(new Date(), 'yyyy-MM-dd'), // Default to today's date
		category: '',
		payee: '',
		description: '',
		account: '',
		transaction: '',
		amount: null,
		currency: 'USD',
	},

	form_Reset() {
		this.form_fields = {
			date: dateFns.format(new Date(), 'yyyy-MM-dd'), // Reset to today's date
			category: '',
			payee: '',
			description: '',
			account: '',
			transaction: '',
			amount: null,
			currency: 'USD',
		};
		this.form_editMode = false;
	},

	form_Edit(record) {
		record.date = dateFns.format(record.date, 'yyyy-MM-dd');

		this.form_editMode = true;
		this.form_fields = record;
		this.form_Modal.showModal();
	},

	async form_Delete(record) {
		const prompt = confirm(`Are you sure you want to delete the record with ID ${record.id}?`);

		if (prompt) {
			this.onwait = true;

			const Request = await API.deleteRecord(record.id);

			if (Request.ok) {
				this.BKDATA = this.BKDATA.filter((item) => item.id !== record.id);
				this.DATA = this.BKDATA;
				this.filter_Apply();
				notyf.success('Success deleting record');
			} else {
				notyf.error('Error deleting record');
			}

			this.onwait = false;
		}
	},

	async form_Submit() {
		this.onwait = true;

		this.form_fields.amount = parseFloat(this.form_fields.amount);

		if (this.form_editMode) {
			const Request = await API.updateRecord(this.form_fields);

			// Edit Record Request
			if (Request.ok) {
				this.BKDATA.map((item) => {
					if (item.id === this.form_fields.id) item = this.form_fields;
					return item;
				});
				this.DATA = this.BKDATA;

				this.form_Reset();
				this.filter_Apply();
				this.form_Modal.close();
			} else {
				notyf.error('Error saving record');
			}
		}
		// Add New Record Request
		else {
			const Request = await API.saveRecord(this.form_fields);

			if (Request.ok) {
				if (!this.form_saveAndAddOther) this.form_Modal.close();

				this.BKDATA.unshift(Request.data);
				this.BKDATA.sort((a, b) => new Date(b.date) - new Date(a.date));
				this.DATA = this.BKDATA;

				this.form_Reset();
				this.filter_Apply();
			} else {
				notyf.error('Error saving record');
			}
		}

		this.onwait = false;
	},

	async init() {
		console.log('HOME component initialized');
		this.onwait = true;

		// Set current date range as default filter
		const today = new Date();
		this.filter.date.from = dateFns.startOfMonth(today);
		this.filter.date.to = dateFns.endOfMonth(today);
		this.filter.date.formattedFrom = dateFns.format(this.filter.date.from, 'MMM dd, yyyy');
		this.filter.date.formattedTo = dateFns.format(this.filter.date.to, 'MMM dd, yyyy');

		// Set values for form
		this.form_El = this.$refs.MainForm;

		// Set options for inputs and selects
		const getGlobals = await API.getGlobals();
		this.opts.accounts = getGlobals.accounts;
		this.opts.currencies = getGlobals.currencies;
		this.opts.categories = getGlobals.categories;
		this.opts.groupedCategories = getGlobals.groupedCategories;
		this.opts.transactions = getGlobals.transactionMethods;

		// Set DATA
		const getRecords = await API.getRecords();
		this.DATA = getRecords;
		this.BKDATA = getRecords;

		// Apply filters
		this.filter_Apply();

		this.onwait = false;
	},
});
