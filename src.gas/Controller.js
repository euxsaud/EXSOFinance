/**
 * Method to get Globals vars and custom vars by self user
 */
function GetGlobals() {
	const ss = LoadSpreadsheet();
	const sheet = ss.getSheetByName('GLOBALS');
	const lastRow = sheet.getLastRow();

	let results = { categories: [], groupedCategories: {}, transactionMethods: [], accounts: [], currencies: [] };
	let range, values, bgColors, txtColors;

	// Get Categories
	range = sheet.getRange('A2:B' + lastRow);
	values = range.getValues();
	bgColors = range.getBackgrounds();
	txtColors = range.getFontColors();

	// Set Categories
	let groupOf = '';
	for (let i = 0; i <= lastRow - 2; i++) {
		groupOf = (values[i][0] !== '' ? values[i][0] : groupOf).toLowerCase();
		results.categories.push({
			groupOf,
			value: values[i][1].toLowerCase(),
			style: [bgColors[i][1], txtColors[i][1]],
		});
	}

	// Load custom categories
	const customCats = HandleTaxonomy('GET', 'customcat');
	customCats.forEach((item) => results.categories.push(item));

	// Set Grouped Categories
	results.categories.forEach((item) => {
		if (!results.groupedCategories[item.groupOf]) {
			results.groupedCategories[item.groupOf] = [];
		}
		results.groupedCategories[item.groupOf].push(item);
	});

	// Get & Set Transaction Methods
	range = sheet.getRange('C2:D' + lastRow);
	values = range.getValues().filter((item) => !!item[0]);
	bgColors = range.getBackgrounds();
	txtColors = range.getFontColors();

	for (let i = 0; i <= values.length - 1; i++) {
		results.transactionMethods.push({
			value: values[i][0].toLowerCase(),
			operator: values[i][1].toLowerCase(),
			style: [bgColors[i][0], txtColors[i][0]],
		});
	}

	// Get & Set Currencies
	range = sheet.getRange('E2:F' + lastRow);
	values = range
		.getValues()
		.filter((item) => !!item[0])
		.map((item) => ({ label: item[0], value: item[1] }));
	results.currencies = values;

	// Get & Set Accounts
	results.accounts = HandleTaxonomy('GET', 'account');

	return results;
}

/**
 * Method to handle taxonomy of the user
 *
 */

function HandleTaxonomy(method = 'GET', taxonomyKey, data, $ID) {
	const sheet = GetUserSheet();
	const lastRow = sheet.getLastRow();

	const reJson = /^\s*\{[\s\S]*\}\s*$/;

	// Set Solutions (GET, POST, UPDATE)
	method = method.toUpperCase();
	const Solution = {};

	Solution.GET = () => {
		const range = sheet.getRange(`K3:M${lastRow}`);
		const values = range.getValues();

		const response = values
			.filter((item) => item[1] === taxonomyKey)
			.map((item) => {
				const isObj = reJson.test(item[2]);
				const id = item[0];
				let dato = isObj ? JSON.parse(item[2]) : item[2];

				dato = isObj ? { ...dato, id } : [id, dato];

				return dato;
			});

		return response;
	};

	Solution.POST = () => {
		const range = sheet.getRange('K3:M3');

		range.insertCells(SpreadsheetApp.Dimension.ROWS);

		const id = HandleID().GetAndUpdate();

		const dato = typeof data === 'object' ? JSON.stringify(data) : data;

		range.setValues([[id, taxonomyKey, dato]]);

		return { ok: true, id, taxonomy: taxonomyKey, data };
	};

	Solution.UPDATE = () => {
		const cell = sheet.getRange(`K3:K${lastRow}`).createTextFinder($ID).matchEntireCell(true).findNext();

		if (!cell) return { ok: false, message: 'Taxonomy Element not found' };

		const row = cell.getRow();

		const dato = typeof data === 'object' ? JSON.stringify(data) : data;

		const setValue = [$ID, taxonomyKey, dato];

		sheet.getRange(`K${row}:M${row}`).setValues([setValue]);

		return { ok: true };
	};

	Solution.DELETE = () => {
		const cell = sheet.getRange(`k3:K${lastRow}`).createTextFinder($ID).matchEntireCell(true).findNext();

		if (!cell) return { ok: false, messsage: 'Could not delete item' };

		const row = cell.getRow();

		sheet.getRange(`K${row}:M${row}`).deleteCells(SpreadsheetApp.Dimension.ROWS);

		return { ok: true };
	};

	return Solution[method]();
}

/**
 * Este metodo se encarga de obtener el ID para agregar un nuevo registro y actualizar este ID para hacerlo autoincremental.
 * This method get the ID to add a new register and update it to make it autoincrement.
 */
function HandleID() {
	const sheet = GetUserSheet();
	const lastRow = sheet.getLastRow();

	const range = sheet.getRange('L3:M' + lastRow);
	const values = range.getValues();
	const nextid = values.filter((item) => item[0] === 'NEXTID')[0][1];

	return {
		GetID() {
			return nextid;
		},
		UpdateID() {
			const rangeK = sheet.getRange('L3:L');
			const finder = rangeK.createTextFinder('NEXTID').matchEntireCell(true);
			const cellK = finder.findNext();

			if (!cellK) throw new Error('Key "NEXTID" it not was found');

			const row = cellK.getRow();
			sheet.getRange('M' + row).setValue(nextid + 1);
		},
		GetAndUpdate() {
			const KeepID = nextid;

			this.UpdateID();

			return KeepID;
		},
	};
}

/**
 * Method to get All records of user
 */
function GetRecords() {
	const sheet = GetUserSheet();
	const lastRow = sheet.getLastRow();

	const range = sheet.getRange('A3:I' + lastRow);
	const values = range.getValues();

	const cleanEmptyValues = values.filter((item) => item[0] !== '');

	const prepareValues = cleanEmptyValues.map((item, index) => {
		const [id, date, category, payee, description, transaction, account, amount, currency] = item;
		return { id, date, category, payee, description, transaction, account, amount, currency };
	});

	const sortValues = prepareValues.sort((a, b) => new Date(b.date) - new Date(a.date));

	const response = JSON.stringify(sortValues);

	console.log(response);

	return response;
}

/**
 * Method to save a new record
 */
function SaveRecord(data = {}) {
	const { date, category, payee, description, account, transaction, amount, currency } = data;
	const handleID = HandleID();

	const sheet = GetUserSheet();
	const range = sheet.getRange('A3:I3');

	range.insertCells(SpreadsheetApp.Dimension.ROWS);

	const id = handleID.GetAndUpdate();
	const newRecord = [id, date, category, payee, description, transaction, account, amount, currency];

	data.id = id;

	range.setValues([newRecord]);

	return { ok: true, data };
}

/**
 * Method to update/edit a record
 */
function UpdateRecord(data = {}) {
	const { id, date, category, payee, description, transaction, account, amount, currency } = data;

	const sheet = GetUserSheet();
	const lastRow = sheet.getLastRow();

	let cellID = sheet
		.getRange('A3:A' + lastRow)
		.createTextFinder(id)
		.matchEntireCell(true)
		.findNext();

	if (!cellID) return { ok: false, message: 'ID not found' };

	const row = cellID.getRow();

	sheet.getRange(`B${row}:I${row}`).setValues([[date, category, payee, description, transaction, account, amount, currency]]);

	return { ok: true };
}

/**
 * Method to delete a record by ID
 */
function DeleteRecord(id) {
	const sheet = GetUserSheet();
	const lastRow = sheet.getLastRow();

	const cellID = sheet
		.getRange('A3:A' + lastRow)
		.createTextFinder(id)
		.matchEntireCell(true)
		.findNext();

	if (!cellID) return { ok: false, message: 'ID not found' };

	const row = cellID.getRow();

	sheet.getRange(`A${row}:I${row}`).deleteCells(SpreadsheetApp.Dimension.ROWS);

	return { ok: true };
}
