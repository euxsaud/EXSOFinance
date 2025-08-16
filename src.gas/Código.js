function doGet(event) {
	const page = event.parameter.page || 'home';
	const template = HtmlService.createTemplateFromFile('index');

	template.page = page;
	template.theme = UserSession('get', 'theme').data || 'lightgreen';

	return template.evaluate().setTitle('EXSOFinance').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename, isView = false) {
	const path = isView ? `views/${filename}` : filename;
	const template = HtmlService.createTemplateFromFile(path);

	// template.user = 'EdgarDB';

	return template.evaluate().getContent();
}

// Migrate all dara from the old Sheet to New Sheet
function MigrateDataFromOldSheet() {
	const ss = SpreadsheetApp.openById('1NVtSREi10suY2UaSkxTk43pUrc_jJXSgdNK-6qf_U3Y'); // Open old balance log sheet
	const oldSheet = ss.getSheetByName('BalanceLog');
	const lastRow = oldSheet.getLastRow();

	const range = oldSheet.getRange(`A3:G${lastRow}`);
	const values = range.getValues().filter((row) => !!row[0]);

	const data = values.map(([date, category, payee, description, transaction, account, amount], index) => {
		// Change value for transaction
		switch (transaction) {
			case 'My expenses':
				transaction = 'expense';
				break;
			case 'INCOME':
				transaction = 'income';
				break;
			case 'JAUS expenses':
				transaction = 'other';
				break;
			default:
				transaction;
		}

		// Change value for accounts
		switch (account) {
			case 'My Chase debit':
				account = 'My chase debit';
				break;
			case 'Chase debit':
				account = 'jaus chase debit';
				break;
			case 'Business Prime':
				account = 'business prime';
				break;
			case 'Prime':
				account = 'amazon prime';
				break;
			case 'Credit by JAUS':
				account = 'jaus credit';
				break;
			default:
				account;
		}

		account = account.toLowerCase();

		date = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');

		return [values.length - index, date, category, payee, description, transaction, account, amount, 'USD'];
	});

	// START MIGRATION
	const newSheet = GetUserSheet();
	const dataLength = data.length;

	const getMaxRows = newSheet.getMaxRows();
	// newSheet.insertRowsAfter(getMaxRows, dataLength);

	newSheet.getRange('A3:I' + (dataLength + 2)).setValues(data);
}
