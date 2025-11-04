/**
 * Buick GMC Sales Tracker - Main Backend Code
 * Google Apps Script Implementation
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Sales Data',
  ARCHIVE_SHEET_PREFIX: 'Archive_',
  HEADER_ROW: 1
};

/**
 * Creates menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Sales Tracker')
    .addItem('Open Tracker', 'showSalesTracker')
    .addSeparator()
    .addItem('Initialize Sheets', 'initializeSheets')
    .addItem('Export to CSV', 'exportCurrentView')
    .addToUi();

  // Auto-initialize if needed
  initializeSheets();
}

/**
 * Shows the sales tracker web app
 */
function showSalesTracker() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(1400)
    .setHeight(900)
    .setTitle('Buick GMC Sales Tracker');
  SpreadsheetApp.getUi().showModalDialog(html, 'Buick GMC Sales Tracker');
}

/**
 * Initialize required sheets
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);

    // Set up headers
    const headers = [
      'ID', 'Date', 'Deal Number', 'Stock Number', 'Make', 'Model', 'Year',
      'Customer Name', 'Lead Type', 'Sales Person', 'Trade In', 'Trade In Value',
      'Sale Price', 'Front End Profit', 'Back End Profit', 'Total Profit',
      'Financing', 'Warranty', 'Insurance', 'Notes', 'Created At'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#2196F3').setFontColor('white');
    sheet.setFrozenRows(1);

    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return true;
}

/**
 * Get all sales data
 */
function getAllSalesData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      return [];
    }

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return [];
    }

    const dataRange = sheet.getRange(2, 1, lastRow - 1, 21);
    const values = dataRange.getValues();

    return values.map(row => ({
      id: row[0],
      date: row[1] ? formatDate(row[1]) : '',
      dealNumber: row[2],
      stockNumber: row[3],
      make: row[4],
      model: row[5],
      year: row[6],
      customerName: row[7],
      leadType: row[8],
      salesPerson: row[9],
      tradeIn: row[10],
      tradeInValue: row[11],
      salePrice: row[12],
      frontEndProfit: row[13],
      backEndProfit: row[14],
      totalProfit: row[15],
      financing: row[16],
      warranty: row[17],
      insurance: row[18],
      notes: row[19],
      createdAt: row[20] ? formatDate(row[20]) : ''
    })).filter(deal => deal.id); // Filter out empty rows
  } catch (error) {
    console.error('Error getting sales data:', error);
    return [];
  }
}

/**
 * Save a new sale or update existing one
 */
function saveSale(saleData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      initializeSheets();
      return saveSale(saleData);
    }

    // Calculate total profit
    const totalProfit = parseFloat(saleData.frontEndProfit || 0) + parseFloat(saleData.backEndProfit || 0);

    const rowData = [
      saleData.id || new Date().getTime(),
      saleData.date || new Date(),
      saleData.dealNumber || '',
      saleData.stockNumber || '',
      saleData.make || '',
      saleData.model || '',
      saleData.year || new Date().getFullYear(),
      saleData.customerName || '',
      saleData.leadType || '',
      saleData.salesPerson || '',
      saleData.tradeIn || false,
      parseFloat(saleData.tradeInValue || 0),
      parseFloat(saleData.salePrice || 0),
      parseFloat(saleData.frontEndProfit || 0),
      parseFloat(saleData.backEndProfit || 0),
      totalProfit,
      saleData.financing || false,
      saleData.warranty || false,
      saleData.insurance || false,
      saleData.notes || '',
      saleData.createdAt || new Date()
    ];

    // Check if updating existing sale
    if (saleData.id) {
      const lastRow = sheet.getLastRow();
      for (let i = 2; i <= lastRow; i++) {
        if (sheet.getRange(i, 1).getValue() == saleData.id) {
          sheet.getRange(i, 1, 1, rowData.length).setValues([rowData]);
          return { success: true, message: 'Sale updated successfully', id: saleData.id };
        }
      }
    }

    // Add new sale
    sheet.appendRow(rowData);
    return { success: true, message: 'Sale added successfully', id: rowData[0] };

  } catch (error) {
    console.error('Error saving sale:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Delete a sale by ID
 */
function deleteSale(dealId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      return { success: false, message: 'Sheet not found' };
    }

    const lastRow = sheet.getLastRow();
    for (let i = 2; i <= lastRow; i++) {
      if (sheet.getRange(i, 1).getValue() == dealId) {
        sheet.deleteRow(i);
        return { success: true, message: 'Sale deleted successfully' };
      }
    }

    return { success: false, message: 'Sale not found' };
  } catch (error) {
    console.error('Error deleting sale:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Archive sales for a specific month
 */
function archiveMonth(monthYear) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      return { success: false, message: 'Sales sheet not found' };
    }

    // Create or get archive sheet
    const archiveSheetName = CONFIG.ARCHIVE_SHEET_PREFIX + monthYear;
    let archiveSheet = ss.getSheetByName(archiveSheetName);

    if (!archiveSheet) {
      archiveSheet = ss.insertSheet(archiveSheetName);
      // Copy headers
      const headers = sheet.getRange(1, 1, 1, 21).getValues();
      archiveSheet.getRange(1, 1, 1, 21).setValues(headers);
      archiveSheet.getRange(1, 1, 1, 21).setFontWeight('bold').setBackground('#673AB7').setFontColor('white');
    }

    // Find and move matching rows
    const [year, month] = monthYear.split('-');
    const lastRow = sheet.getLastRow();
    let archivedCount = 0;

    for (let i = lastRow; i >= 2; i--) {
      const dateValue = sheet.getRange(i, 2).getValue();
      if (dateValue) {
        const rowDate = new Date(dateValue);
        if (rowDate.getFullYear() == year && (rowDate.getMonth() + 1) == parseInt(month)) {
          const rowData = sheet.getRange(i, 1, 1, 21).getValues();
          archiveSheet.appendRow(rowData[0]);
          sheet.deleteRow(i);
          archivedCount++;
        }
      }
    }

    return {
      success: true,
      message: `Archived ${archivedCount} sales to ${archiveSheetName}`,
      count: archivedCount
    };

  } catch (error) {
    console.error('Error archiving month:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Get all archived months
 */
function getArchivedMonths() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const archivedData = {};

    sheets.forEach(sheet => {
      const name = sheet.getName();
      if (name.startsWith(CONFIG.ARCHIVE_SHEET_PREFIX)) {
        const monthYear = name.replace(CONFIG.ARCHIVE_SHEET_PREFIX, '');
        const lastRow = sheet.getLastRow();

        if (lastRow > 1) {
          const dataRange = sheet.getRange(2, 1, lastRow - 1, 21);
          const values = dataRange.getValues();

          archivedData[monthYear] = values.map(row => ({
            id: row[0],
            date: row[1] ? formatDate(row[1]) : '',
            dealNumber: row[2],
            stockNumber: row[3],
            make: row[4],
            model: row[5],
            year: row[6],
            customerName: row[7],
            leadType: row[8],
            salesPerson: row[9],
            tradeIn: row[10],
            tradeInValue: row[11],
            salePrice: row[12],
            frontEndProfit: row[13],
            backEndProfit: row[14],
            totalProfit: row[15],
            financing: row[16],
            warranty: row[17],
            insurance: row[18],
            notes: row[19],
            createdAt: row[20] ? formatDate(row[20]) : ''
          }));
        }
      }
    });

    return archivedData;
  } catch (error) {
    console.error('Error getting archived months:', error);
    return {};
  }
}

/**
 * Export data to CSV (returns data for client-side download)
 */
function exportToCSV(data) {
  try {
    const headers = [
      'Date', 'Deal Number', 'Stock Number', 'Make', 'Model', 'Year', 'Customer Name',
      'Lead Type', 'Sales Person', 'Trade In', 'Trade In Value',
      'Sale Price', 'Front End Profit', 'Back End Profit', 'Total Profit',
      'Financing', 'Warranty', 'Insurance', 'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(deal => [
        deal.date,
        deal.dealNumber,
        deal.stockNumber || '',
        deal.make,
        deal.model,
        deal.year,
        `"${deal.customerName}"`,
        deal.leadType,
        `"${deal.salesPerson}"`,
        deal.tradeIn ? 'Yes' : 'No',
        deal.tradeInValue,
        deal.salePrice,
        deal.frontEndProfit,
        deal.backEndProfit,
        deal.totalProfit,
        deal.financing ? 'Yes' : 'No',
        deal.warranty ? 'Yes' : 'No',
        deal.insurance ? 'Yes' : 'No',
        `"${deal.notes || ''}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return '';
  }
}

/**
 * Import data from CSV
 */
function importFromCSV(csvContent) {
  try {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');

    const imported = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i]);

        const saleData = {
          id: new Date().getTime() + i,
          date: values[0] || new Date().toISOString().slice(0, 10),
          dealNumber: values[1] || '',
          stockNumber: values[2] || '',
          make: values[3] || 'Buick',
          model: values[4] || '',
          year: parseInt(values[5]) || new Date().getFullYear(),
          customerName: values[6] ? values[6].replace(/"/g, '') : '',
          leadType: values[7] || 'Walk-in',
          salesPerson: values[8] ? values[8].replace(/"/g, '') : '',
          tradeIn: values[9] === 'Yes',
          tradeInValue: parseFloat(values[10]) || 0,
          salePrice: parseFloat(values[11]) || 0,
          frontEndProfit: parseFloat(values[12]) || 0,
          backEndProfit: parseFloat(values[13]) || 0,
          financing: values[15] === 'Yes',
          warranty: values[16] === 'Yes',
          insurance: values[17] === 'Yes',
          notes: values[18] ? values[18].replace(/"/g, '') : '',
          createdAt: new Date()
        };

        const result = saveSale(saleData);
        if (result.success) {
          imported.push(saleData);
        }
      }
    }

    return { success: true, count: imported.length, message: `Imported ${imported.length} sales` };
  } catch (error) {
    console.error('Error importing CSV:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Helper function to parse CSV line (handles quotes)
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

/**
 * Helper function to format dates consistently
 */
function formatDate(date) {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Get current user email (for logging)
 */
function getUserEmail() {
  return Session.getActiveUser().getEmail();
}

/**
 * Get spreadsheet URL
 */
function getSpreadsheetUrl() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}
