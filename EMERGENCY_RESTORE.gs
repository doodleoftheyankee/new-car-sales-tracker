/**
 * EMERGENCY_RESTORE.gs
 *
 * This will restore your tracker to working condition
 * Run this, then try opening the tracker
 */

function emergencyRestore() {
  Logger.log("Starting emergency restore...");

  try {
    // Initialize sheets if needed
    initializeSheets();

    Logger.log("✓ Sheets initialized");

    // Test if we can get sales data
    var sales = getAllSalesData();
    Logger.log("✓ Can read sales data: " + sales.length + " sales found");

    // Test if tracker can open
    var html = HtmlService.createHtmlOutputFromFile('index')
      .setWidth(1400)
      .setHeight(900)
      .setTitle('Buick GMC Sales Tracker');

    Logger.log("✓ Tracker HTML created successfully");

    Browser.msgBox(
      "✅ RESTORE SUCCESSFUL",
      "Your tracker is ready!\n\n" +
      "Sales found: " + sales.length + "\n\n" +
      "Close this dialog and try:\n" +
      "Sales Tracker → Open Tracker",
      Browser.Buttons.OK
    );

    return true;

  } catch (e) {
    Logger.log("✗ ERROR: " + e.message);
    Browser.msgBox(
      "❌ PROBLEM FOUND",
      "Error: " + e.message + "\n\n" +
      "The problem is: " + e.message + "\n\n" +
      "Tell me this error message!",
      Browser.Buttons.OK
    );
    return false;
  }
}

function forceReloadTracker() {
  showSalesTracker();
}
