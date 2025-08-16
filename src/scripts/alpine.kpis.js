// IMPORTS > Dependencies
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval, getYear } from 'date-fns';
import { contrastColors } from './Utils.js';
import API from './API.js';

// MAIN Component
export default () => ({
	DATA: [],
	BKDATA: [],
	onwait: false,
	opts: {
		accounts: [],
		currencies: [],
		categories: [],
		transactions: [],
	},

	util_FormatCurrency(value) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: this.filter.currency,
			minimumFractionDigits: 2,
		}).format(value);
	},

	/**
	 * Variables and Methods for managing filters.
	 * These are used to filter the displayed data based on user input.
	 */
	filter: {
		date: { from: null, to: null, formattedFrom: null, formattedTo: null, pickmode: 'bymonth' },
		currency: 'USD',
	},

	filter_SetDate(event) {
		const value = event.target.value.split('/');

		if (value.length === 2) {
			const [from, to] = value;
			this.filter.date.from = parseISO(from);
			this.filter.date.to = parseISO(to);
		} else {
			const date = parseISO(value[0]);
			this.filter.date.from = startOfMonth(date);
			this.filter.date.to = endOfMonth(date);
		}

		this.filter.date.formattedFrom = format(this.filter.date.from, 'MMMM dd, yyyy');
		this.filter.date.formattedTo = format(this.filter.date.to, 'MMMM dd, yyyy');

		this.filter_Apply();
	},

	filter_Apply() {
		this.DATA = this.BKDATA.filter((item) => {
			const ItemDate = parseISO(item.date);

			const byDaterange = isWithinInterval(ItemDate, { start: this.filter.date.from, end: this.filter.date.to });
			const byCurrency = item.currency === this.filter.currency;

			return byDaterange && byCurrency;
		});

		// Recalculate stats after filtering
		this.stats_SetIndicators();
	},

	stats: {
		income: { total: 0, transactions: 0, style: [] },
		expense: { total: 0, transactions: 0, style: [] },
		investment: { total: 0, transactions: 0, style: [] },
		other: { total: 0, transactions: 0, style: [] },
		balance: { total: 0, profit: 0 },
		expensesByCategory: [],
		expensesByAccount: [],
		chartPieToColumn: true,
	},

	stats_SetIndicators() {
		const indicators = {
			balance: { total: 0, profit: 0 },
		};
		const filteredData = {};

		this.opts.transactions.forEach((transaction) => {
			indicators[transaction.value] = { total: 0, transactions: 0 };

			const filterRecords = this.DATA.filter((item) => item.transaction === transaction.value);

			let total = parseFloat(filterRecords.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
			total = transaction.operator === 'add' ? total : -total;

			const transactions = filterRecords.length;

			const getStyle = transaction.style || [];

			indicators[transaction.value] = { total, transactions, style: getStyle };
			filteredData[transaction.value] = filterRecords;
		});

		// Calculate total & profit for balance
		for (const key in indicators) {
			indicators.balance.total += key === 'other' ? 0 : indicators[key].total;
		}

		indicators.balance.total = parseFloat(indicators.balance.total.toFixed(2));
		indicators.balance.profit = ((indicators.balance.total / parseFloat(indicators.income.total)) * 100).toFixed(2);

		// Set expenses by category
		const expensesByCategory = filteredData.expense.reduce((acc, item) => {
			const style =
				this.opts.categories.find((cat) => cat.value.toLowerCase() === item.category.toLowerCase())?.style[0] || '#333333';
			if (!acc[item.category]) acc[item.category] = [0, style];
			acc[item.category][0] += item.amount;
			return acc;
		}, {});

		this.stats.expensesByCategory = Object.entries(expensesByCategory).map(([category, [amount, bgcolor]]) => [
			category,
			amount,
			bgcolor,
		]);

		// Set expenses by account
		const expensesByAccount = filteredData.expense.reduce((acc, item) => {
			const style = this.opts.accounts.find((acc) => acc.value.toLowerCase() === item.account.toLowerCase())?.style[0] || '#333333';
			if (!acc[item.account]) acc[item.account] = [0, style];
			acc[item.account][0] += item.amount;
			return acc;
		}, {});

		this.stats.expensesByAccount = Object.entries(expensesByAccount).map(([account, [amount, bgcolor]]) => [account, amount, bgcolor]);

		// Set indicators in the stats object
		this.stats = { ...this.stats, ...indicators };
	},

	stats_TotalCard(transaction = 'Expense', cardName) {
		const filterRecords = this.DATA.filter((item) => item.transaction === transaction && item.account === cardName);
		// Log the total expenses
		const totalAmount = filterRecords.reduce((total, item) => total + item.amount, 0).toFixed(2);
		return totalAmount;
	},

	/**
	 * Methods to manage charts
	 * These methods initialize and draw various charts based on the filtered data.
	 * They use Google Charts to visualize the data.
	 */
	chart_Init() {
		google.charts.load('current', { packages: ['corechart', 'line', 'bar'] });

		// Watch for changes in the stats data and redraw charts
		this.$watch('stats.expensesByCategory', (newData) => this.chart_ExpensesByCategory(newData));
		this.$watch('stats.expensesByAccount', (newData) => this.chart_AccountsExpenses(newData));
		this.$watch('filter.currency', () => this.chart_HistoryBalance());
		this.$watch('BKDATA', () => this.chart_HistoryBalance());

		// Observe the body background color and text color changes
		new MutationObserver(() => {
			this.chart_ExpensesByCategory();
			this.chart_AccountsExpenses();
			this.chart_HistoryBalance();
		}).observe(document.body, {
			attributes: true,
			attributeFilter: ['data-theme', 'style'],
		});
	},

	// Mount the chart for expenses by category
	chart_ExpensesByCategory(data) {
		data = data || this.stats.expensesByCategory;
		const chartId = 'category_expenses_charts';
		const colors = data.map((item) => item[2]);
		const chartData = data.map((item) => [item[0], item[1]]);
		const keysTable = ['Category', 'Total Expenses'];
		const options = {
			colors,
			title: 'Expenses by Category',
		};
		this.DrawPieChart(chartId, keysTable, chartData, options);
	},

	// Mount the chart for expenses by account
	chart_AccountsExpenses(data) {
		data = data || this.stats.expensesByAccount;
		const chartId = 'accounts_expenses_charts';
		const colors = data.map((item) => item[2]);
		const chartData = data.map((item) => [item[0].toUpperCase(), item[1]]);
		const keysTable = ['Account', 'Total Expenses'];
		const options = {
			colors,
			title: 'Expenses by Account',
		};

		this.DrawPieChart(chartId, keysTable, chartData, options);
	},

	chart_HistoryBalance() {
		const year = new Date().getFullYear();
		const chartId = 'history_balance_charts';
		const keysTable = ['Date', 'Income', 'Expenses', 'Investments', 'Other'];
		const options = {
			title: 'History of Balance',
			hAxis: { title: 'Date' },
			vAxis: { title: 'Amount' },
			colors: [
				this.opts.transactions.find((t) => t.value === 'income')?.style[0] || 'green',
				this.opts.transactions.find((t) => t.value === 'expense')?.style[0] || 'red',
				this.opts.transactions.find((t) => t.value === 'investment')?.style[0] || 'yellow',
				this.opts.transactions.find((t) => t.value === 'other')?.style[0] || 'gray',
			],
		};

		// Set data groups
		const groupedData = {};
		this.BKDATA.forEach(({ date, transaction, currency, amount }) => {
			// Skip if the transaction type or currency does not match the filter
			if (this.filter.currency !== currency) return;

			// Normalize date to the first of the month
			date = typeof date === 'string' ? parseISO(date) : date;
			const startMonth = startOfMonth(date);

			// Set formatted date like key
			const key = format(startMonth, 'MM-01-yyyy');

			// Initialize the group or accumulate the values
			if (!groupedData[key]) groupedData[key] = { date: startMonth, [transaction]: 0 };
			groupedData[key][transaction] = (groupedData[key][transaction] || 0) + amount;
		});

		// Build chart data
		const chartData = Object.values(groupedData)
			.map((item) => {
				const date = format(item.date, 'MMM yyyy');
				const other = item.other || 0;
				const income = item.income || 0;
				const expenses = item.expense || 0;
				const investments = item.investment || 0;

				return [date, income, expenses, investments, other];
			})
			.filter((item) => getYear(item[0]) === year);

		this.DrawLineChart(chartId, keysTable, chartData, options);
	},

	DrawPieChart(chartId, keysTable, data, opts = {}) {
		const { baseBgColor, baseTextColor } = contrastColors();

		data = google.visualization.arrayToDataTable([keysTable, ...data]);

		// Convert data to currency format
		const formatter = new google.visualization.NumberFormat({
			prefix: '$',
			fractionDigits: 2,
		});
		formatter.format(data, 1);

		// Set options for the chart
		const options = {
			pieSliceText: 'value',
			title: 'Chart Title Undefined',
			backgroundColor: 'transparent',
			pieSliceBorderColor: baseBgColor,
			titleTextStyle: { color: baseTextColor },
			chartArea: { width: '90%', height: '90%' },
			pieSliceTextStyle: { color: 'white', fontSize: 12 },
			legend: { position: 'right', alignment: 'center' },
			...opts,
		};

		if (/dark/.test(document.body.getAttribute('data-theme'))) {
			options.legend.textStyle = { color: baseTextColor };
		}

		const chart = new google.visualization.PieChart(document.getElementById(chartId));
		chart.draw(data, options);
	},

	DrawLineChart(chartId, keysTable, data, opts = {}) {
		const { baseBgColor, baseTextColor } = contrastColors();

		data = google.visualization.arrayToDataTable([keysTable, ...data]);

		// Convert data to currency format
		const formatter = new google.visualization.NumberFormat({
			prefix: '$',
			fractionDigits: 2,
		});
		formatter.format(data, 1);
		formatter.format(data, 2);
		formatter.format(data, 3);

		// Set options for the chart
		const options = {
			title: 'Chart Title Undefined',
			backgroundColor: 'transparent',
			hAxis: { title: 'H Axis Title' },
			vAxis: { title: 'V Axis Title' },
			titleTextStyle: { color: baseTextColor },
			legend: { position: 'bottom' },
			lineWidth: 3,
			...opts,
		};

		// Forse set options
		options.hAxis.textStyle = { color: baseTextColor };
		options.vAxis.textStyle = { color: baseTextColor };
		options.legend.textStyle = { color: baseTextColor };

		if (/dark/.test(document.body.getAttribute('data-theme'))) {
			options.vAxis.gridlines = { color: '#636e72' };
			options.vAxis.minorGridlines = { color: '#2d3436' };
		}

		// Create and draw the chart
		const chart = new google.visualization.LineChart(document.getElementById(chartId));
		chart.draw(data, options);
	},

	DrawColumnChart(chartId, keysTable, data, opts = {}) {
		const { baseBgColor, baseTextColor } = contrastColors();

		data = google.visualization.arrayToDataTable([keysTable, ...data]);

		// Convert data to currency format
		const formatter = new google.visualization.NumberFormat({
			prefix: '$',
			fractionDigits: 2,
		});
		formatter.format(data, 1);

		// Set options for the chart
		const options = {
			title: 'Chart Title Undefined',
			backgroundColor: 'transparent',
			hAxis: { title: 'H Axis Title' },
			vAxis: { title: 'V Axis Title' },
			titleTextStyle: { color: baseTextColor },
			legend: { position: 'bottom' },
			...opts,
		};

		// Forse set options
		options.hAxis.textStyle = { color: baseTextColor };
		options.vAxis.textStyle = { color: baseTextColor };
		options.legend.textStyle = { color: baseTextColor };

		if (/dark/.test(document.body.getAttribute('data-theme'))) {
			options.vAxis.gridlines = { color: '#636e72' };
			options.vAxis.minorGridlines = { color: '#2d3436' };
		}

		// Create and draw the chart
		const chart = new google.visualization.ColumnChart(document.getElementById(chartId));
		chart.draw(data, options);
	},

	async init() {
		console.log('KPIS Component Initialized');
		this.onwait = true;

		// Initialize stats chart
		this.chart_Init();

		// Set current date range to the last month
		const today = new Date();
		this.filter.date.from = startOfMonth(today);
		this.filter.date.to = endOfMonth(today);
		this.filter.date.formattedFrom = format(this.filter.date.from, 'MMMM dd, yyyy');
		this.filter.date.formattedTo = format(this.filter.date.to, 'MMMM dd, yyyy');

		// Set options from API
		const getOptions = await API('getOptions');
		this.opts.accounts = getOptions.accounts;
		this.opts.currencies = getOptions.currencies;
		this.opts.categories = getOptions.categories;
		this.opts.transactions = getOptions.transactions;

		// Fetch initial data
		const getRecords = await API('data');
		this.DATA = getRecords;
		this.BKDATA = getRecords;

		// Apply initial filter
		this.filter_Apply();

		// Set stats
		this.stats_SetIndicators();

		this.onwait = false;
	},
});
