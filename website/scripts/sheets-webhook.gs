/**
 * FITologist.me — lead log (Google Apps Script web app).
 *
 * Paste into: your Google Sheet → Extensions → Apps Script.
 * Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone → Deploy.
 * Copy the web app URL into the SHEETS_WEBHOOK_URL environment variable on Vercel.
 *
 * The website's /api/lead function POSTs one JSON object per lead; this appends it as a row.
 *
 * Columns are matched BY HEADER NAME (row 1), so you may reorder or add your own columns freely.
 * Any field the website sends that has no column yet gets a new header appended at the end
 * (e.g. "floor_test", "bmi_category", "sex"); existing rows are never moved.
 */

/** Order used only when the sheet is brand new (empty). */
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
  "sex",
  "floor_test",
  "bmi_category",
];

var SHEET_NAME = "Leads";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Header row on first use.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.setFrozenRows(1);
    }

    // Current headers (row 1), trimmed; empty trailing cells ignored.
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
      return String(h).trim();
    });
    while (header.length && header[header.length - 1] === "") header.pop();

    // Append a header for every incoming field that has no column yet.
    Object.keys(data).forEach(function (key) {
      if (header.indexOf(key) === -1) {
        header.push(key);
        sheet.getRange(1, header.length).setValue(key);
      }
    });

    // Build the row by header name (columns the website doesn't send stay empty).
    var row = header.map(function (key) {
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
