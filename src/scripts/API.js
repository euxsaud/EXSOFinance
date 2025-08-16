import { parseISO } from 'date-fns';

const MAINDATA = {};

MAINDATA.records = [
	[1, '2025-07-19', 'Fuel', 'Walmart Fuel Station', '', 'expense', 'chase credit', 37.42, 'USD'],
	[2, '2025-07-18', 'Books, audio, subcriptions', 'Netflix', '', 'expense', 'business prime', 8.72, 'USD'],
	[3, '2025-07-15', 'Groceries', 'Walmart', '', 'expense', 'chase credit', 104.79, 'USD'],
	[4, '2025-07-15', 'Groceries', 'Costco', '', 'expense', 'chase credit', 131.6, 'USD'],
	[5, '2025-07-13', 'Software, apps, games', 'Copilot', '', 'expense', 'chase credit', 10.91, 'USD'],
	[6, '2025-07-13', 'Fuel', 'Walmart Fuel Station', '', 'expense', 'chase credit', 39.72, 'USD'],
	[7, '2025-07-12', 'Charity, gifts', 'Target', 'Juegete sobrinos', 'expense', 'business prime', 155.81, 'USD'],
	[8, '2025-07-12', 'Charity, gifts', 'Remitly', 'choy', 'expense', 'chase debit', 154.99, 'USD'],
	[9, '2025-07-08', 'Fuel', 'Walmart Fuel Station', '', 'expense', 'chase credit', 42.34, 'USD'],
	[10, '2025-07-08', '', '', '', 'income', '', 690, 'USD'],
	[10, '2025-07-08', 'Investment', 'GBM+', '', 'investment', 'debit', 690, 'USD'],
	[11, '2025-06-06', 'Fuel', 'Circle K', '', 'expense', 'business prime', 16.35, 'USD'],
	[12, '2025-07-05', '', '', 'Pago Jared, tabla costco', 'income', '', 34, 'USD'],
	[13, '2025-07-05', 'Shopping', 'Costco', '', 'expense', 'chase credit', 37.98, 'USD'],
	[14, '2025-07-04', 'Groceries', 'Walmart', '', 'expense', 'chase credit', 70.7, 'USD'],
	[15, '2025-07-04', 'Fuel', 'QT', '', 'expense', 'business prime', 41.83, 'USD'],
	[16, '2025-07-04', 'Loan, interests, taxes', 'Zelle', 'Prestamo Yadira', 'expense', 'chase debit', 500, 'USD'],
	[17, '2025-07-02', 'Supplies, tools', 'Home Depot', 'Desengrasante', 'expense', 'chase credit', 40.9, 'USD'],
	[18, '2025-07-02', 'Vehicle maintenance', 'Llantera ???', 'Colocación de llantas', 'expense', 'cash', 45, 'USD'],
	[19, '2025-07-01', 'Bills, leasing, insurance', 'Rockledge Fairways', '', 'expense', 'chase debit', 1477.4, 'USD'],
	[20, '2025-07-01', 'Bills, leasing, insurance', 'SRC', 'Luz', 'other', 'jaus credit', 50.535, 'USD'],
	[21, '2025-07-01', 'Leasing', 'Car payment', '', 'other', 'jaus credit', 400, 'USD'],
	[22, '2025-07-01', 'Vehicle Insurance', '', '', 'other', 'jaus credit', 99, 'USD'],
	[64, '2025-06-30', '', '', '', 'income', 'chase debit', 4649, 'USD'],
	[23, '2025-06-28', 'Vehicle maintenance', 'Walmart ', 'Tires x2', 'expense', 'chase credit', 145.99, 'USD'],
	[24, '2025-06-28', 'Groceries', 'Costco', '', 'expense', 'chase credit', 66.42, 'USD'],
	[25, '2025-06-27', 'Shopping', 'Amazon ', '', 'expense', 'chase credit', 161.29, 'USD'],
	[26, '2025-06-26', 'Groceries', 'Walmart ', '', 'expense', 'chase credit', 105.8, 'USD'],
	[27, '2025-06-23', 'Food, Drinks', 'Bashas', '', 'expense', 'business prime', 7.27, 'USD'],
	[28, '2025-06-23', 'Fuel', 'Costco', '', 'expense', 'chase credit', 35.53, 'USD'],
	[29, '2025-06-23', 'Groceries', 'Costco', '', 'expense', 'chase credit', 88.37, 'USD'],
	[30, '2025-06-22', 'Restaurant, fast-food', 'Panda Express', '', 'expense', 'business prime', 18.49, 'USD'],
	[31, '2025-06-21', 'Groceries', 'bashas', '', 'expense', 'business prime', 9.42, 'USD'],
	[32, '2025-06-21', 'Groceries', 'Target', '', 'expense', 'business prime', 25.86, 'USD'],
	[33, '2025-06-21', 'Shopping', 'Ganestop', '', 'expense', 'business prime', 96.6, 'USD'],
	[34, '2025-06-22', 'Shopping', 'Amazon', '', 'expense', 'chase credit', 57.76, 'USD'],
	[35, '2025-06-20', 'Restaurant, fast-food', 'Canes', '', 'expense', 'business prime', 18.69, 'USD'],
	[36, '2025-06-20', '', '', 'Pago de prestamo Yadira', 'income', '', 500, 'USD'],
	[37, '2025-06-19', 'Charity, gifts', 'Remitly', 'Pa Choy otravez 😒', 'expense', 'chase debit', 154.99, 'USD'],
	[38, '2025-06-19', 'Groceries', 'Walmart', '', 'expense', 'chase credit', 95.31, 'USD'],
	[39, '2025-06-18', 'Software, apps, games', 'Squarespace', 'Pago Pagina Tony', 'expense', 'chase credit', 27.15, 'USD'],
	[40, '2025-06-16', 'Fuel', 'Costco', '', 'expense', 'chase credit', 36.43, 'USD'],
	[41, '2025-06-15', '', '', 'Renta Ma', 'income', '', 690, 'USD'],
	[42, '2025-06-14', 'Shopping', 'Amazon', '', 'expense', 'chase credit', 170.97, 'USD'],
	[43, '2025-06-13', 'Restaurant, fast-food', 'jack in the box', '', 'expense', 'business prime', 15.19, 'USD'],
	[44, '2025-06-09', 'Fuel', 'Costco', '', 'expense', 'chase credit', 38.09, 'USD'],
	[45, '2025-06-09', 'Groceries', 'Costco', '', 'expense', 'chase credit', 63.98, 'USD'],
	[46, '2025-06-09', 'Groceries', 'Walmart', '', 'expense', 'business prime', 33.76, 'USD'],
	[47, '2025-06-07', 'Software, apps, games', 'OpenAI', 'ChatGPT', 'expense', 'chase credit', 21.72, 'USD'],
	[48, '2025-06-06', 'Fuel', 'QT', '', 'expense', 'business prime', 20.19, 'USD'],
	[49, '2025-06-06', 'Groceries', "Fry's", '', 'expense', 'business prime', 29.45, 'USD'],
	[50, '2025-06-06', 'Vehicle maintenance', 'Mecanico', 'Reparaciónes', 'expense', 'cash', 1100, 'USD'],
	[51, '2025-06-05', 'Loan, interests, taxes', '', 'Prestamo Yadira', 'expense', 'chase debit', 500, 'USD'],
	[52, '2025-06-03', 'Vehicle maintenance', "O'Reilly", 'Battery Car', 'expense', 'chase credit', 219.36, 'USD'],
	[53, '2025-06-03', 'Vehicle maintenance', 'Brakes Plus', 'Oil Change Silverado', 'expense', 'chase credit', 92.58, 'USD'],
	[54, '2025-06-02', 'Groceries', 'Walmart', '', 'expense', 'chase credit', 92.27, 'USD'],
	[55, '2025-06-02', 'Fuel', 'Costco', '', 'expense', 'chase credit', 67.86, 'USD'],
	[56, '2025-06-01', 'Software, apps, games', 'Copilot', '', 'expense', 'chase credit', 10, 'USD'],
	[57, '2025-06-01', 'Software, apps, games', 'namecheap', '', 'expense', 'business prime', 17.16, 'USD'],
	[58, '2025-06-01', 'Bills, leasing, insurance', 'Rockledge Fairways', '', 'expense', "Tony's chase debit", 1476.05, 'USD'],
	[59, '2025-06-01', 'Bills, leasing, insurance', 'SRC', 'Luz', 'other', 'jaus credit', 47.645, 'USD'],
	[60, '2025-06-01', 'Leasing', 'Car payment', '', 'other', 'jaus credit', 400, 'USD'],
	[61, '2025-06-01', 'Vehicle Insurance', '', '', 'other', 'jaus credit', 99, 'USD'],
	[62, '2025-05-30', 'Restaurant, fast-food', 'Olive Garden', '', 'expense', 'business prime', 35.38, 'USD'],
	[63, '2025-05-29', 'Groceries', 'costco', '', 'expense', 'chase credit', 149.81, 'USD'],
	[64, '2025-07-30', '', '', '', 'income', 'chase debit', 3080, 'USD'],
	[1207, '2024-12-31', '', '', '', 'income', '', 5182.5, 'USD'],
	[1206, '2024-12-31', 'Fuel', 'Costco', '', 'expense', 'chase credit', 34.73, 'USD'],
	[1205, '2024-12-31', 'Groceries', 'Walmart', '', 'expense', 'business prime', 40.87, 'USD'],
	[1204, '2024-12-30', 'Shopping', 'Amazon', '', 'expense', 'business prime', 77.42, 'USD'],
	[1203, '2024-12-28', 'Shopping', 'Walmart', '', 'expense', 'business prime', 45.59, 'USD'],
	[1202, '2024-12-27', 'Vehicle maintenance', 'Super Start Car Wash', '', 'expense', 'business prime', 11.0, 'USD'],
	[1201, '2024-12-25', 'Shopping', 'Amazon', '', 'expense', 'business prime', 158.71, 'USD'],
	[1200, '2024-12-24', 'Groceries', 'frys', '', 'expense', 'business prime', 41.74, 'USD'],
	[1199, '2024-12-23', 'Groceries', 'Costco', '', 'expense', 'chase credit', 28.47, 'USD'],
	[1198, '2024-12-23', 'Groceries', 'Food City', '', 'expense', 'business prime', 40.49, 'USD'],
	[1197, '2024-12-23', 'Shopping', 'Puma', 'Chrismas gifts', 'expense', 'business prime', 118.57, 'USD'],
	[1196, '2024-12-23', 'Shopping', 'Reebok', 'Chrismas gifts', 'expense', 'business prime', 32.33, 'USD'],
	[1195, '2024-12-23', 'Shopping', 'Nike', 'Chrismas gifts', 'expense', 'business prime', 163.62, 'USD'],
	[1194, '2024-12-22', 'Groceries', 'Walmart', '', 'expense', 'business prime', 50.74, 'USD'],
	[1193, '2024-12-22', 'Shopping', 'BestBuy', '', 'expense', 'business prime', 104.84, 'USD'],
	[1192, '2024-12-22', 'Restaurant, fast-food', 'Jack in the Box', '', 'expense', 'chase credit', 23.43, 'USD'],
	[1191, '2024-12-22', 'Fuel', 'Walmart', '', 'other', 'business prime', 32.35, 'USD'],
	[1190, '2024-12-21', 'Groceries', 'Costco Business', '', 'expense', 'chase credit', 97.75, 'USD'],
	[1189, '2024-12-21', 'Supplies, tools', 'Costco Business', '', 'other', 'chase credit', 100.28, 'USD'],
	[1188, '2024-12-21', 'Supplies, tools', 'Restaurant Depot', '', 'other', 'business prime', 99.41, 'USD'],
	[1187, '2024-12-20', 'Food, Drinks', 'QuickTrip', '', 'expense', 'business prime', 7.87, 'USD'],
	[1186, '2024-12-20', 'Software, apps, games', 'ProntonMail', 'VPN', 'expense', 'business prime', 9.99, 'USD'],
	[1185, '2024-12-20', 'Life & Entertainment', 'Netflix', '', 'expense', 'business prime', 5.82, 'USD'],
	[1184, '2024-12-19', 'Shopping', 'BestBuy', '', 'expense', 'business prime', 135.72, 'USD'],
	[1183, '2024-12-19', 'Vehicle maintenance', 'Break Plus', '', 'expense', 'business prime', 81.47, 'USD'],
	[1182, '2024-12-19', 'Fuel', 'Walmart', '', 'expense', 'business prime', 25.71, 'USD'],
	[1181, '2024-12-17', 'Wellness, beauty', 'EOS Fitness', '', 'expense', 'business prime', 23.33, 'USD'],
	[1180, '2024-12-16', '', '', 'income', '', 760.0, 'USD'],
	[1179, '2024-12-16', 'Fuel', 'Walmart', '', 'other', 'business prime', 32.12, 'USD'],
	[1178, '2024-12-15', 'Restaurant, fast-food', 'Little Caesars', '', 'expense', 'business prime', 26.57, 'USD'],
];

MAINDATA.categories = [
	{ groupOf: 'food & drinks', value: 'groceries', style: ['#d65745', '#ffffff'] },
	{ groupOf: 'food & drinks', value: 'restaurant, fast-food', style: ['#d65745', '#ffffff'] },
	{ groupOf: 'food & drinks', value: 'food, drinks', style: ['#d65745', '#ffffff'] },
	{ groupOf: 'shopping', value: 'clothes & shoes', style: ['#3498db', '#ffffff'] },
	{ groupOf: 'shopping', value: 'electronics & accesories', style: ['#3498db', '#ffffff'] },
	{ groupOf: 'shopping', value: 'gifts, joy', style: ['#3498db', '#ffffff'] },
	{ groupOf: 'shopping', value: 'health & beauty', style: ['#3498db', '#ffffff'] },
	{ groupOf: 'shopping', value: 'pets, animals', style: ['#3498db', '#ffffff'] },
	{ groupOf: 'shopping', value: 'shopping', style: ['#3498db', '#ffffff'] },
	{ groupOf: 'shopping', value: 'stationery, tools', style: ['#3498db', '#ffffff'] },
	{ groupOf: 'transportation', value: 'taxi', style: ['#95a5a6', '#ffffff'] },
	{ groupOf: 'transportation', value: 'long distance', style: ['#95a5a6', '#ffffff'] },
	{ groupOf: 'transportation', value: 'public transport', style: ['#95a5a6', '#ffffff'] },
	{ groupOf: 'transportation', value: 'tools', style: ['#95a5a6', '#ffffff'] },
	{ groupOf: 'vehicle', value: 'fuel', style: ['#9b59b6', '#ffffff'] },
	{ groupOf: 'vehicle', value: 'leasing', style: ['#9b59b6', '#ffffff'] },
	{ groupOf: 'vehicle', value: 'parking', style: ['#9b59b6', '#ffffff'] },
	{ groupOf: 'vehicle', value: 'vehicle maintenance', style: ['#9b59b6', '#ffffff'] },
	{ groupOf: 'vehicle', value: 'vehicle insurance', style: ['#9b59b6', '#ffffff'] },
	{ groupOf: 'life & entertainment', value: 'life & entertainment', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'books, audio, subcriptions', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'charity, gifts', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'education, development', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'health care, doctor', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'holiday, trips, hotels', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'wellness, beauty', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'hobbies', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'life & entertainment', value: 'active sport, fitness', style: ['#2ecc71', '#000000'] },
	{ groupOf: 'communication, pc, digital assets', value: 'software, apps, games', style: ['#686de0', '#ffffff'] },
	{ groupOf: 'communication, pc, digital assets', value: 'postal services', style: ['#686de0', '#ffffff'] },
	{ groupOf: 'communication, pc, digital assets', value: 'phone, internet', style: ['#686de0', '#ffffff'] },
	{ groupOf: 'financial expendes', value: 'loan, interests, taxes', style: ['#22a6b3', '#ffffff'] },
	{ groupOf: 'investment', value: 'investments', style: ['#e84393', '#ffffff'] },
	{ groupOf: 'investment', value: 'transfers', style: ['#e84393', '#ffffff'] },
	{ groupOf: 'essentials', value: 'bills, leasing, insurance', style: ['#34495e', '#ffffff'] },
	{ groupOf: 'others', value: 'missing', style: ['#ecf0f1', '#000000'] },
	{ groupOf: 'income', value: 'checks, coupons', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'gifts', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'interests, dividends', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'lending, dividends', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'lottery, gambling', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'refounds (tax, purchase)', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'rental income', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'sale', style: ['#f39c12', '#ffffff'] },
	{ groupOf: 'income', value: 'wage, invoices', style: ['#f39c12', '#ffffff'] },
];

MAINDATA.transactions = [
	{ value: 'income', operator: 'add', style: ['#2ecc71', '#000000'] },
	{ value: 'expense', operator: 'subtract', style: ['#e74c3c', '#ffffff'] },
	{ value: 'investment', operator: 'subtract', style: ['#e84393', '#ffffff'] },
	{ value: 'other', operator: 'subtract', style: ['#95a5a6', '#2c3e50'] },
];

MAINDATA.accounts = [
	{ id: 1, value: 'cash', provider: 'Self', type: 'cash', limit: null, currency: 'USD', style: ['#d65745', '#ffffff'] },
	{ id: 2, value: 'business prime', provider: 'AMEX', type: 'credit', limit: 10000, currency: 'USD', style: ['#3498db', '#ffffff'] },
	{ id: 3, value: 'chase credit', provider: 'Chase', type: 'credit', limit: 5000, currency: 'USD', style: ['#2ecc71', '#000000'] },
	{ id: 4, value: 'chase debit', provider: 'Chase', type: 'debit', limit: null, currency: 'USD', style: ['#9b59b6', '#ffffff'] },
	{ id: 5, value: 'jaus credit', provider: 'JAUS Property', type: 'other', limit: null, currency: 'USD', style: ['#95a5a6', '#ffffff'] },
	{ id: 6, value: 'bbva', provider: 'BBVA', type: 'debit', limit: null, currency: 'MXN', style: ['#34495e', '#ffffff'] },
];

MAINDATA.currencies = [
	{ value: 'MXN', label: 'Mexican Peso (MXN)' },
	{ value: 'USD', label: 'US Dollar (USD)' },
	{ value: 'EUR', label: 'Euro (EUR)' },
	{ value: 'GBP', label: 'British Pound (GBP)' },
	{ value: 'JPY', label: 'Japanese Yen (JPY)' },
	{ value: 'CNY', label: 'Chinese Yuan (CNY)' },
	{ value: 'INR', label: 'Indian Rupee (INR)' },
];

MAINDATA.groupedCategories = function () {
	const data = this.categories;
	let grouped = {};

	data.forEach((item) => {
		if (!grouped[item.groupOf]) {
			grouped[item.groupOf] = [];
		}

		grouped[item.groupOf].push(item);
	});

	return grouped;
};

MAINDATA.getOptions = function () {
	return {
		accounts: this.accounts,
		currencies: this.currencies,
		categories: this.categories,
		transactions: this.transactions,
		groupedCategories: this.groupedCategories(),
	};
};

MAINDATA.data = function () {
	return this.records.map((item) => ({
		id: item[0],
		date: item[1],
		category: item[2],
		payee: item[3],
		description: item[4],
		account: item[6],
		transaction: item[5],
		amount: item[7],
		currency: item[8],
	}));
};

export default function (keyname) {
	// Get a random number between 1 to 5
	const delay = Math.floor(Math.random() * 2) + 1;

	return new Promise((resolve, reject) => {
		const result = typeof MAINDATA[keyname] === 'function' ? MAINDATA[keyname]() : MAINDATA[keyname];
		if (result) {
			setTimeout(() => {
				resolve(result);
			}, delay * 1000); // Convert seconds to milliseconds
		} else {
			reject(new Error(`No data found for key: ${keyname}`));
		}
	});
}

// Method to save data in local storage
export function POST(key, data) {
	const keyname = 'exsofinance';

	return new Promise((resolve, reject) => {
		try {
			let lsdata = JSON.parse(localStorage.getItem(keyname)) || {};
			if (!lsdata) {
				localStorage.setItem(keyname, JSON.stringify({}));
				lsdata = {};
			}

			lsdata[key] = { ...lsdata[key], ...data };

			localStorage.setItem(keyname, JSON.stringify(lsdata));
			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
}

export function GET(key) {
	const keyname = 'exsofinance';

	return new Promise((resolve, reject) => {
		try {
			const lsdata = JSON.parse(localStorage.getItem(keyname)) || {};
			if (lsdata[key]) {
				resolve(lsdata[key]);
			} else {
				resolve(null); // Return null if key does not exist
			}
		} catch (error) {
			reject(error);
		}
	});
}
