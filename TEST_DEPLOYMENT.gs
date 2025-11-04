/**
 * TEST_DEPLOYMENT.gs
 * Simple test to verify all features are deployed correctly
 *
 * INSTRUCTIONS:
 * 1. Copy this entire file
 * 2. In Apps Script, click + to add new Script file
 * 3. Name it "TEST_DEPLOYMENT"
 * 4. Paste this code
 * 5. Click Run → select "testDeployment" from dropdown
 * 6. Check the logs (View → Logs) for results
 */

function testDeployment() {
  Logger.log("=== TESTING DEPLOYMENT ===\n");

  var results = {
    passed: [],
    failed: []
  };

  // Test 1: Check if Code.gs functions exist
  try {
    if (typeof getAllSalesData === 'function') {
      results.passed.push("✓ Code.gs - getAllSalesData found");
    } else {
      results.failed.push("✗ Code.gs - getAllSalesData NOT found");
    }
  } catch (e) {
    results.failed.push("✗ Code.gs - Error: " + e.message);
  }

  // Test 2: Check if Analytics.gs functions exist
  try {
    if (typeof getQuarterlyAnalysis === 'function') {
      results.passed.push("✓ Analytics.gs - getQuarterlyAnalysis found");
    } else {
      results.failed.push("✗ Analytics.gs - getQuarterlyAnalysis NOT found");
    }
  } catch (e) {
    results.failed.push("✗ Analytics.gs - NOT deployed or error: " + e.message);
  }

  // Test 3: Check if AI_Insights.gs functions exist
  try {
    if (typeof generateQuarterlyInsights === 'function') {
      results.passed.push("✓ AI_Insights.gs - generateQuarterlyInsights found");
    } else {
      results.failed.push("✗ AI_Insights.gs - generateQuarterlyInsights NOT found");
    }
  } catch (e) {
    results.failed.push("✗ AI_Insights.gs - NOT deployed or error: " + e.message);
  }

  // Test 4: Check if index.html exists
  try {
    var html = HtmlService.createHtmlOutputFromFile('index');
    if (html) {
      results.passed.push("✓ index.html - File found");
    }
  } catch (e) {
    results.failed.push("✗ index.html - Error: " + e.message);
  }

  // Test 5: Check if sheets are initialized
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Sales Data');
    if (sheet) {
      results.passed.push("✓ Sales Data sheet exists");
    } else {
      results.failed.push("✗ Sales Data sheet NOT found (run Initialize Sheets)");
    }
  } catch (e) {
    results.failed.push("✗ Sheet check error: " + e.message);
  }

  // Test 6: Try to run quarterly analysis
  try {
    var analysis = getQuarterlyAnalysis(2025);
    if (analysis && analysis.quarters) {
      results.passed.push("✓ Quarterly analysis runs successfully");
    } else {
      results.failed.push("✗ Quarterly analysis returned unexpected result");
    }
  } catch (e) {
    results.failed.push("✗ Quarterly analysis error: " + e.message);
  }

  // Print Results
  Logger.log("\n=== PASSED TESTS ===");
  results.passed.forEach(function(test) {
    Logger.log(test);
  });

  Logger.log("\n=== FAILED TESTS ===");
  if (results.failed.length === 0) {
    Logger.log("None - All tests passed! 🎉");
  } else {
    results.failed.forEach(function(test) {
      Logger.log(test);
    });
  }

  Logger.log("\n=== SUMMARY ===");
  Logger.log("Passed: " + results.passed.length + " / " + (results.passed.length + results.failed.length));
  Logger.log("Failed: " + results.failed.length + " / " + (results.passed.length + results.failed.length));

  if (results.failed.length === 0) {
    Logger.log("\n✅ DEPLOYMENT SUCCESSFUL!");
    Logger.log("All features are deployed correctly.");
    Logger.log("You should see Quarterly, AI Insights, and Settings tabs in your tracker.");
  } else {
    Logger.log("\n❌ DEPLOYMENT INCOMPLETE");
    Logger.log("Please check the failed tests above.");
    Logger.log("Follow DEPLOYMENT_INSTRUCTIONS.md to fix missing files.");
  }

  // Return summary
  return {
    passed: results.passed.length,
    failed: results.failed.length,
    total: results.passed.length + results.failed.length,
    success: results.failed.length === 0
  };
}

/**
 * Run this to get a simple yes/no answer
 */
function isDeploymentComplete() {
  var result = testDeployment();

  if (result.success) {
    Logger.log("\n✅ YES - Deployment is complete!");
    Browser.msgBox("✅ Deployment Complete!",
                   "All features deployed successfully.\\n\\n" +
                   "Passed: " + result.passed + " / " + result.total + " tests\\n\\n" +
                   "Open the tracker to see Quarterly, AI Insights, and Settings tabs.",
                   Browser.Buttons.OK);
  } else {
    Logger.log("\n❌ NO - Deployment is incomplete");
    Browser.msgBox("❌ Deployment Incomplete",
                   "Some features are missing.\\n\\n" +
                   "Passed: " + result.passed + " / " + result.total + " tests\\n" +
                   "Failed: " + result.failed + " / " + result.total + " tests\\n\\n" +
                   "Check View → Logs for details.\\n" +
                   "Follow DEPLOYMENT_INSTRUCTIONS.md to complete setup.",
                   Browser.Buttons.OK);
  }

  return result.success;
}

/**
 * Check just the HTML file for new tabs
 */
function checkIndexHtml() {
  try {
    var html = HtmlService.createHtmlOutputFromFile('index').getContent();

    var checks = {
      hasQuarterly: html.indexOf("setCurrentView('quarterly')") > -1,
      hasInsights: html.indexOf("setCurrentView('insights')") > -1,
      hasSettings: html.indexOf("setCurrentView('settings')") > -1,
      hasQuarterlyView: html.indexOf("QuarterlyView") > -1,
      hasAIView: html.indexOf("AIInsightsView") > -1,
      hasSettingsView: html.indexOf("SettingsView") > -1
    };

    Logger.log("=== INDEX.HTML CHECK ===");
    Logger.log("Quarterly tab code: " + (checks.hasQuarterly ? "✓ Found" : "✗ NOT FOUND"));
    Logger.log("Insights tab code: " + (checks.hasInsights ? "✓ Found" : "✗ NOT FOUND"));
    Logger.log("Settings tab code: " + (checks.hasSettings ? "✓ Found" : "✗ NOT FOUND"));
    Logger.log("QuarterlyView function: " + (checks.hasQuarterlyView ? "✓ Found" : "✗ NOT FOUND"));
    Logger.log("AIInsightsView function: " + (checks.hasAIView ? "✓ Found" : "✗ NOT FOUND"));
    Logger.log("SettingsView function: " + (checks.hasSettingsView ? "✓ Found" : "✗ NOT FOUND"));

    var allPassed = checks.hasQuarterly && checks.hasInsights && checks.hasSettings &&
                    checks.hasQuarterlyView && checks.hasAIView && checks.hasSettingsView;

    if (allPassed) {
      Logger.log("\n✅ index.html is updated correctly!");
      Browser.msgBox("✅ index.html is correct!",
                     "Your index.html has all the new features.\\n\\n" +
                     "If you still don't see the tabs, try:\\n" +
                     "1. Close and reopen the tracker\\n" +
                     "2. Refresh your spreadsheet\\n" +
                     "3. Check browser console (F12) for errors",
                     Browser.Buttons.OK);
    } else {
      Logger.log("\n❌ index.html needs to be updated!");
      Logger.log("You need to replace index.html with the new version.");
      Logger.log("See DEPLOYMENT_INSTRUCTIONS.md Step 2");
      Browser.msgBox("❌ index.html is outdated",
                     "Your index.html does NOT have the new tabs.\\n\\n" +
                     "YOU MUST:\\n" +
                     "1. Open index.html in Apps Script\\n" +
                     "2. Delete ALL existing code\\n" +
                     "3. Copy new index.html from repository\\n" +
                     "4. Paste and Save\\n\\n" +
                     "See DEPLOYMENT_INSTRUCTIONS.md for details",
                     Browser.Buttons.OK);
    }

    return allPassed;

  } catch (e) {
    Logger.log("Error checking HTML: " + e.message);
    return false;
  }
}
