/**
 * FITologist.me — lead log (Google Apps Script web app).
 *
 * Paste into: your Google Sheet → Extensions → Apps Script.
 * Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone → Deploy.
 * Copy the web app URL into the SHEETS_WEBHOOK_URL environment variable on Vercel.
 *
 * The website's /api/lead function POSTs one JSON object per lead; this appends it as a row.
 */

var COLUMNS = [
  "timestamp",
  "name",
  "whatsapp",
  "age",
  "goals",
  "type",
  "frequency",
  "area",
  "times",
  "notes",
  "language",
  "source",
  "bmi",
  "utm_source",
  "utm_campaign",
  "sex", // added later: appended at the end so existing rows keep their columns
];

var SHEET_NAME = "Leads";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Header row on first use; on an existing sheet, add any header cells that are missing
    // (e.g. a column appended to COLUMNS later) without touching existing rows.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.setFrozenRows(1);
    } else {
      var header = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
      COLUMNS.forEach(function (key, i) {
        if (header[i] === "" || header[i] === null) sheet.getRange(1, i + 1).setValue(key);
      });
    }

    var row = COLUMNS.map(function (key) {
      var value = data[key] === undefined || data[key] === null ? "" : String(data[key]);
      // Prevent spreadsheet formula injection from user input
      return /^[=+\-@]/.test(value) ? "'" + value : value;
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(
      ContentService.MimeType.JSON
    );
  } finally {
    lock.releaseLock();
  }
}

/** Optional: run once from the editor to check the sheet is writable. */
function testAppend() {
  doPost({
    postData: {
      contents: JSON.stringify({ timestamp: "test", name: "Test lead", whatsapp: "+971500000000", source: "/test" }),
    },
  });
}
