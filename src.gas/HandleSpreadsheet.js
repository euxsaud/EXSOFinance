// Method to open and get main spreadsheet for this project.
function LoadSpreadsheet () {
  return SpreadsheetApp.openById("1EkumU-iszmZJty5FZbXkenfAH5xy_OvCc5g6zvskWbo");
}

// Method to get any existing sheet
function GetSheet(sheetName) {
  if (!sheetName) throw new Error('Name Sheet is not defined');

  const ss = LoadSpreadsheet().getSheetByName(sheetName);

  if (!ss) throw new Error(`The sheet with the mane "${sheetName}" not exists`);

  return ss;
}

// Method to get the sheet of the Active user.
function GetUserSheet() {
  const ss = LoadSpreadsheet();
  const user = Session.getActiveUser().getUsername();

  const sheets = ss.getSheets();
  let userSheet = sheets.find(sheet => sheet.getName() === user);

  if (!userSheet) {
    const templateSheet = ss.getSheetByName('TPL');

    if (!templateSheet) throw new Error("The Sheet 'TPL' don't exists");

    // Make a copy
    userSheet = templateSheet.copyTo(ss);
    userSheet.setName(user);

    // Move sheet to the end of sheets
    ss.setActiveSheet(userSheet);
    ss.moveActiveSheet(ss.getSheets().length);

    console.log(`Welcome ${user}, your sheet has beed created.`);
  }

  return userSheet;
}
