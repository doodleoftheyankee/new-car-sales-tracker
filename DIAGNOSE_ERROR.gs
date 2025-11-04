/**
 * DIAGNOSE_ERROR.gs
 *
 * This script will tell you exactly what's wrong
 *
 * INSTRUCTIONS:
 * 1. Copy this entire file
 * 2. In Apps Script, add it as a new Script file
 * 3. Click Run → select "diagnoseError"
 * 4. Click Run button
 * 5. Check View → Logs for the diagnosis
 */

function diagnoseError() {
  Logger.log("====== DIAGNOSTIC REPORT ======\n");

  var report = [];

  // Check 1: Verify basic functions exist
  Logger.log("TEST 1: Checking Code.gs functions...");
  try {
    if (typeof getAllSalesData === 'function') {
      report.push("✓ Code.gs - getAllSalesData exists");
    } else {
      report.push("✗ PROBLEM: getAllSalesData not found in Code.gs");
    }
  } catch (e) {
    report.push("✗ CRITICAL: Error checking Code.gs - " + e.message);
  }

  try {
    if (typeof saveSale === 'function') {
      report.push("✓ Code.gs - saveSale exists");
    } else {
      report.push("✗ PROBLEM: saveSale not found in Code.gs");
    }
  } catch (e) {
    report.push("✗ CRITICAL: saveSale function error - " + e.message);
  }

  // Check 2: Verify Analytics.gs (if it should exist)
  Logger.log("\nTEST 2: Checking Analytics.gs functions...");
  try {
    if (typeof getQuarterlyAnalysis === 'function') {
      report.push("✓ Analytics.gs - getQuarterlyAnalysis exists");
    } else {
      report.push("⚠ WARNING: getQuarterlyAnalysis not found (Analytics.gs missing or not deployed?)");
    }
  } catch (e) {
    report.push("⚠ Analytics.gs not found or has errors - " + e.message);
  }

  // Check 3: Verify AI_Insights.gs (if it should exist)
  Logger.log("\nTEST 3: Checking AI_Insights.gs functions...");
  try {
    if (typeof generateQuarterlyInsights === 'function') {
      report.push("✓ AI_Insights.gs - generateQuarterlyInsights exists");
    } else {
      report.push("⚠ WARNING: generateQuarterlyInsights not found (AI_Insights.gs missing?)");
    }
  } catch (e) {
    report.push("⚠ AI_Insights.gs not found or has errors - " + e.message);
  }

  // Check 4: Verify HTML exists
  Logger.log("\nTEST 4: Checking index.html...");
  try {
    var html = HtmlService.createHtmlOutputFromFile('index');
    if (html) {
      report.push("✓ index.html - File found and can be read");

      // Check if it has the new features
      var content = html.getContent();
      if (content.indexOf("QuarterlyView") > -1) {
        report.push("✓ index.html - Contains QuarterlyView (new version)");
      } else {
        report.push("⚠ index.html - Does NOT contain QuarterlyView (old version)");
      }

      if (content.indexOf("AIInsightsView") > -1) {
        report.push("✓ index.html - Contains AIInsightsView (new version)");
      } else {
        report.push("⚠ index.html - Does NOT contain AIInsightsView (old version)");
      }
    }
  } catch (e) {
    report.push("✗ CRITICAL: index.html error - " + e.message);
  }

  // Check 5: Verify spreadsheet setup
  Logger.log("\nTEST 5: Checking spreadsheet...");
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    report.push("✓ Spreadsheet - Accessible");

    var sheet = ss.getSheetByName('Sales Data');
    if (sheet) {
      report.push("✓ Sales Data sheet - Exists");
    } else {
      report.push("⚠ Sales Data sheet - NOT FOUND (run Initialize Sheets)");
    }
  } catch (e) {
    report.push("✗ Spreadsheet error - " + e.message);
  }

  // Check 6: Try to open the tracker
  Logger.log("\nTEST 6: Testing tracker open function...");
  try {
    var html = HtmlService.createHtmlOutputFromFile('index')
      .setWidth(1400)
      .setHeight(900)
      .setTitle('Buick GMC Sales Tracker');
    report.push("✓ Tracker - Can be created (should open successfully)");
  } catch (e) {
    report.push("✗ CRITICAL: Tracker cannot be created - " + e.message);
  }

  // Print Report
  Logger.log("\n====== RESULTS ======\n");
  report.forEach(function(line) {
    Logger.log(line);
  });

  // Analysis
  Logger.log("\n====== DIAGNOSIS ======\n");

  var criticalErrors = report.filter(function(line) { return line.indexOf("✗ CRITICAL") > -1; });
  var warnings = report.filter(function(line) { return line.indexOf("⚠") > -1; });
  var successes = report.filter(function(line) { return line.indexOf("✓") > -1; });

  if (criticalErrors.length > 0) {
    Logger.log("🔴 CRITICAL ERRORS FOUND (" + criticalErrors.length + "):");
    criticalErrors.forEach(function(err) {
      Logger.log("  " + err);
    });
    Logger.log("\n❌ THE TRACKER WILL NOT WORK");
    Logger.log("Fix the critical errors above first.");
  } else if (warnings.length > 0) {
    Logger.log("⚠ WARNINGS FOUND (" + warnings.length + "):");
    warnings.forEach(function(warn) {
      Logger.log("  " + warn);
    });
    Logger.log("\n⚠ TRACKER MAY HAVE ISSUES");
    Logger.log("The basic tracker might work, but some features may be missing.");
    Logger.log("\nRECOMMENDATION:");
    if (report.some(function(r) { return r.indexOf("old version") > -1; })) {
      Logger.log("→ Your index.html is the OLD version (no AI features)");
      Logger.log("→ This is OK for basic functionality");
      Logger.log("→ Remove Analytics.gs and AI_Insights.gs if you have them");
      Logger.log("→ OR update to new index.html if you want AI features");
    } else {
      Logger.log("→ Your index.html has NEW features");
      Logger.log("→ But backend files (Analytics.gs, AI_Insights.gs) are missing");
      Logger.log("→ Either add those files OR revert to old index.html");
    }
  } else {
    Logger.log("✅ NO CRITICAL ERRORS FOUND");
    Logger.log("Passed: " + successes.length + " tests");
    Logger.log("\n✅ TRACKER SHOULD WORK!");
    Logger.log("\nIf tracker still won't open:");
    Logger.log("1. Press F12 in browser when opening tracker");
    Logger.log("2. Check Console tab for errors");
    Logger.log("3. Send me a screenshot of the errors");
  }

  // Return summary
  Browser.msgBox(
    "Diagnostic Complete",
    "Critical Errors: " + criticalErrors.length + "\n" +
    "Warnings: " + warnings.length + "\n" +
    "Passed: " + successes.length + "\n\n" +
    "Check View → Logs for full details.",
    Browser.Buttons.OK
  );
}

/**
 * Quick version check
 */
function checkWhichVersion() {
  try {
    var html = HtmlService.createHtmlOutputFromFile('index').getContent();

    var hasQuarterly = html.indexOf("QuarterlyView") > -1;
    var hasAI = html.indexOf("AIInsightsView") > -1;
    var hasSettings = html.indexOf("SettingsView") > -1;

    if (hasQuarterly && hasAI && hasSettings) {
      Logger.log("✓ You have the NEW version with AI features");
      Browser.msgBox("NEW VERSION", "Your index.html has the new AI features.\n\nYou MUST also have Analytics.gs and AI_Insights.gs", Browser.Buttons.OK);
      return "new";
    } else {
      Logger.log("✓ You have the OLD version (basic tracker)");
      Browser.msgBox("OLD VERSION", "Your index.html is the basic version.\n\nThis is OK - it should work fine.\n\nDo NOT add Analytics.gs or AI_Insights.gs", Browser.Buttons.OK);
      return "old";
    }
  } catch (e) {
    Logger.log("✗ Error checking version: " + e.message);
    Browser.msgBox("ERROR", "Could not check version:\n\n" + e.message, Browser.Buttons.OK);
    return "error";
  }
}

/**
 * Test if tracker can open
 */
function testTrackerOpen() {
  try {
    // Try to create the HTML
    var html = HtmlService.createHtmlOutputFromFile('index')
      .setWidth(1400)
      .setHeight(900)
      .setTitle('Test');

    Logger.log("✓ Tracker HTML was created successfully");
    Logger.log("✓ The tracker SHOULD open when you click the menu");

    Browser.msgBox(
      "✅ SUCCESS",
      "Tracker can be created successfully!\n\n" +
      "Try opening it now:\n" +
      "Sales Tracker → Open Tracker\n\n" +
      "If it still doesn't open:\n" +
      "1. Press F12 in browser\n" +
      "2. Look at Console tab for errors\n" +
      "3. Send screenshot of errors",
      Browser.Buttons.OK
    );

    return true;
  } catch (e) {
    Logger.log("✗ ERROR: " + e.message);
    Browser.msgBox(
      "❌ FAILED",
      "Tracker cannot be created.\n\nError:\n" + e.message + "\n\n" +
      "This means there's a problem with index.html.\n\n" +
      "Try:\n" +
      "1. Delete and re-copy index.html\n" +
      "2. Make sure you copied the ENTIRE file",
      Browser.Buttons.OK
    );
    return false;
  }
}
