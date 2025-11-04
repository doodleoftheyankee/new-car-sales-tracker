/**
 * Analytics.gs - Advanced Analytics and Quarterly Analysis
 * Provides quarterly insights, trends, and analysis
 */

/**
 * Get quarterly analysis data
 */
function getQuarterlyAnalysis(year) {
  try {
    const currentYear = year || new Date().getFullYear();
    const quarters = {
      Q1: { months: [0, 1, 2], name: 'Q1', data: [] },
      Q2: { months: [3, 4, 5], name: 'Q2', data: [] },
      Q3: { months: [6, 7, 8], name: 'Q3', data: [] },
      Q4: { months: [9, 10, 11], name: 'Q4', data: [] }
    };

    // Get all sales data
    const allSales = getAllSalesData();

    // Organize by quarter
    allSales.forEach(sale => {
      const saleDate = new Date(sale.date);
      if (saleDate.getFullYear() === currentYear) {
        const month = saleDate.getMonth();

        for (const [qName, qData] of Object.entries(quarters)) {
          if (qData.months.includes(month)) {
            qData.data.push(sale);
            break;
          }
        }
      }
    });

    // Also check archived data
    const archivedData = getArchivedMonths();
    Object.entries(archivedData).forEach(([monthYear, sales]) => {
      const [archiveYear, archiveMonth] = monthYear.split('-');
      if (parseInt(archiveYear) === currentYear) {
        const monthIndex = parseInt(archiveMonth) - 1;

        for (const [qName, qData] of Object.entries(quarters)) {
          if (qData.months.includes(monthIndex)) {
            qData.data.push(...sales);
            break;
          }
        }
      }
    });

    // Calculate metrics for each quarter
    const analysis = {};
    Object.entries(quarters).forEach(([qName, qData]) => {
      analysis[qName] = calculateQuarterMetrics(qData.data, qName, currentYear);
    });

    return {
      year: currentYear,
      quarters: analysis,
      yearToDate: calculateYearToDateMetrics(allSales, archivedData, currentYear)
    };

  } catch (error) {
    console.error('Error in quarterly analysis:', error);
    return { error: error.toString() };
  }
}

/**
 * Calculate metrics for a quarter
 */
function calculateQuarterMetrics(sales, quarterName, year) {
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.salePrice || 0), 0);
  const totalProfit = sales.reduce((sum, s) => sum + parseFloat(s.totalProfit || 0), 0);
  const frontEndProfit = sales.reduce((sum, s) => sum + parseFloat(s.frontEndProfit || 0), 0);
  const backEndProfit = sales.reduce((sum, s) => sum + parseFloat(s.backEndProfit || 0), 0);

  // Brand breakdown
  const buickSales = sales.filter(s => s.make === 'Buick').length;
  const gmcSales = sales.filter(s => s.make === 'GMC').length;

  // Lead source analysis
  const leadSources = {};
  sales.forEach(s => {
    leadSources[s.leadType] = (leadSources[s.leadType] || 0) + 1;
  });

  // F&I penetration
  const financingPenetration = sales.filter(s => s.financing).length;
  const warrantyPenetration = sales.filter(s => s.warranty).length;
  const insurancePenetration = sales.filter(s => s.insurance).length;

  // Trade-in analysis
  const tradesIn = sales.filter(s => s.tradeIn).length;
  const avgTradeValue = tradesIn > 0
    ? sales.filter(s => s.tradeIn).reduce((sum, s) => sum + parseFloat(s.tradeInValue || 0), 0) / tradesIn
    : 0;

  // Sales person performance
  const salesPeople = {};
  sales.forEach(s => {
    if (!salesPeople[s.salesPerson]) {
      salesPeople[s.salesPerson] = { count: 0, revenue: 0, profit: 0 };
    }
    salesPeople[s.salesPerson].count++;
    salesPeople[s.salesPerson].revenue += parseFloat(s.salePrice || 0);
    salesPeople[s.salesPerson].profit += parseFloat(s.totalProfit || 0);
  });

  // Top performers
  const topPerformers = Object.entries(salesPeople)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, stats]) => ({
      name,
      sales: stats.count,
      revenue: stats.revenue,
      profit: stats.profit,
      avgProfit: stats.count > 0 ? stats.profit / stats.count : 0
    }));

  return {
    period: quarterName,
    year: year,
    totalSales,
    totalRevenue,
    totalProfit,
    frontEndProfit,
    backEndProfit,
    avgSalePrice: totalSales > 0 ? totalRevenue / totalSales : 0,
    avgProfit: totalSales > 0 ? totalProfit / totalSales : 0,
    profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    buickSales,
    gmcSales,
    leadSources,
    fAndI: {
      financing: financingPenetration,
      financingRate: totalSales > 0 ? (financingPenetration / totalSales) * 100 : 0,
      warranty: warrantyPenetration,
      warrantyRate: totalSales > 0 ? (warrantyPenetration / totalSales) * 100 : 0,
      insurance: insurancePenetration,
      insuranceRate: totalSales > 0 ? (insurancePenetration / totalSales) * 100 : 0
    },
    trades: {
      count: tradesIn,
      tradeRate: totalSales > 0 ? (tradesIn / totalSales) * 100 : 0,
      avgValue: avgTradeValue
    },
    topPerformers,
    salesPeople: Object.keys(salesPeople).length
  };
}

/**
 * Calculate year-to-date metrics
 */
function calculateYearToDateMetrics(salesData, archivedData, year) {
  const allSalesThisYear = salesData.filter(s => {
    const saleDate = new Date(s.date);
    return saleDate.getFullYear() === year;
  });

  // Add archived sales from this year
  Object.entries(archivedData).forEach(([monthYear, sales]) => {
    const [archiveYear] = monthYear.split('-');
    if (parseInt(archiveYear) === year) {
      allSalesThisYear.push(...sales);
    }
  });

  return calculateQuarterMetrics(allSalesThisYear, 'YTD', year);
}

/**
 * Get comparative analysis between quarters
 */
function getComparativeAnalysis(year) {
  try {
    const quarterlyData = getQuarterlyAnalysis(year);
    const quarters = quarterlyData.quarters;

    const comparisons = [];
    const qNames = ['Q1', 'Q2', 'Q3', 'Q4'];

    for (let i = 1; i < qNames.length; i++) {
      const current = quarters[qNames[i]];
      const previous = quarters[qNames[i - 1]];

      if (current.totalSales > 0 || previous.totalSales > 0) {
        comparisons.push({
          period: `${qNames[i]} vs ${qNames[i - 1]}`,
          salesGrowth: calculateGrowth(previous.totalSales, current.totalSales),
          revenueGrowth: calculateGrowth(previous.totalRevenue, current.totalRevenue),
          profitGrowth: calculateGrowth(previous.totalProfit, current.totalProfit),
          avgProfitGrowth: calculateGrowth(previous.avgProfit, current.avgProfit)
        });
      }
    }

    return {
      year,
      quarterlyData,
      comparisons
    };
  } catch (error) {
    console.error('Error in comparative analysis:', error);
    return { error: error.toString() };
  }
}

/**
 * Calculate growth percentage
 */
function calculateGrowth(previous, current) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}

/**
 * Get trend analysis
 */
function getTrendAnalysis(months = 12) {
  try {
    const allSales = getAllSalesData();
    const archivedData = getArchivedMonths();

    // Combine all sales
    const allSalesCombined = [...allSales];
    Object.values(archivedData).forEach(sales => {
      allSalesCombined.push(...sales);
    });

    // Sort by date
    allSalesCombined.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get last N months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const recentSales = allSalesCombined.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    // Group by month
    const monthlyData = {};
    recentSales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          sales: 0,
          revenue: 0,
          profit: 0,
          avgProfit: 0
        };
      }

      monthlyData[monthKey].sales++;
      monthlyData[monthKey].revenue += parseFloat(sale.salePrice || 0);
      monthlyData[monthKey].profit += parseFloat(sale.totalProfit || 0);
    });

    // Calculate averages
    Object.keys(monthlyData).forEach(month => {
      const data = monthlyData[month];
      data.avgProfit = data.sales > 0 ? data.profit / data.sales : 0;
      data.avgSalePrice = data.sales > 0 ? data.revenue / data.sales : 0;
    });

    return {
      period: `Last ${months} months`,
      monthlyData,
      trend: calculateTrend(monthlyData)
    };

  } catch (error) {
    console.error('Error in trend analysis:', error);
    return { error: error.toString() };
  }
}

/**
 * Calculate trend direction
 */
function calculateTrend(monthlyData) {
  const months = Object.keys(monthlyData).sort();
  if (months.length < 2) return 'insufficient_data';

  const firstHalf = months.slice(0, Math.floor(months.length / 2));
  const secondHalf = months.slice(Math.floor(months.length / 2));

  const firstHalfAvg = firstHalf.reduce((sum, m) => sum + monthlyData[m].sales, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, m) => sum + monthlyData[m].sales, 0) / secondHalf.length;

  if (secondHalfAvg > firstHalfAvg * 1.1) return 'strong_upward';
  if (secondHalfAvg > firstHalfAvg) return 'upward';
  if (secondHalfAvg < firstHalfAvg * 0.9) return 'downward';
  return 'stable';
}

/**
 * Export quarterly report to new sheet
 */
function exportQuarterlyReport(year, quarter) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = `Report_${year}_${quarter}`;

    // Delete existing sheet if it exists
    let reportSheet = ss.getSheetByName(sheetName);
    if (reportSheet) {
      ss.deleteSheet(reportSheet);
    }

    reportSheet = ss.insertSheet(sheetName);

    // Get quarterly data
    const analysis = getQuarterlyAnalysis(year);
    const quarterData = analysis.quarters[quarter];

    if (!quarterData) {
      return { success: false, message: 'Quarter data not found' };
    }

    // Build report
    const reportData = [
      ['QUARTERLY SALES REPORT'],
      [''],
      ['Period:', `${quarter} ${year}`],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['SUMMARY METRICS'],
      ['Total Sales', quarterData.totalSales],
      ['Total Revenue', `$${quarterData.totalRevenue.toFixed(2)}`],
      ['Total Profit', `$${quarterData.totalProfit.toFixed(2)}`],
      ['Average Sale Price', `$${quarterData.avgSalePrice.toFixed(2)}`],
      ['Average Profit per Sale', `$${quarterData.avgProfit.toFixed(2)}`],
      ['Profit Margin', `${quarterData.profitMargin.toFixed(2)}%`],
      [''],
      ['BRAND BREAKDOWN'],
      ['Buick Sales', quarterData.buickSales],
      ['GMC Sales', quarterData.gmcSales],
      [''],
      ['F&I PENETRATION'],
      ['Financing', `${quarterData.fAndI.financing} (${quarterData.fAndI.financingRate.toFixed(1)}%)`],
      ['Warranty', `${quarterData.fAndI.warranty} (${quarterData.fAndI.warrantyRate.toFixed(1)}%)`],
      ['Insurance', `${quarterData.fAndI.insurance} (${quarterData.fAndI.insuranceRate.toFixed(1)}%)`],
      [''],
      ['TRADE-INS'],
      ['Total Trades', quarterData.trades.count],
      ['Trade Rate', `${quarterData.trades.tradeRate.toFixed(1)}%`],
      ['Average Trade Value', `$${quarterData.trades.avgValue.toFixed(2)}`],
      [''],
      ['TOP PERFORMERS'],
      ['Name', 'Sales', 'Revenue', 'Profit', 'Avg Profit']
    ];

    quarterData.topPerformers.forEach(p => {
      reportData.push([
        p.name,
        p.sales,
        `$${p.revenue.toFixed(2)}`,
        `$${p.profit.toFixed(2)}`,
        `$${p.avgProfit.toFixed(2)}`
      ]);
    });

    // Write to sheet
    reportSheet.getRange(1, 1, reportData.length, 5).setValues(
      reportData.map(row => {
        while (row.length < 5) row.push('');
        return row;
      })
    );

    // Format
    reportSheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
    reportSheet.getRange('A6').setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
    reportSheet.getRange('A14').setFontWeight('bold').setBackground('#2196F3').setFontColor('white');
    reportSheet.getRange('A18').setFontWeight('bold').setBackground('#FF9800').setFontColor('white');
    reportSheet.getRange('A22').setFontWeight('bold').setBackground('#9C27B0').setFontColor('white');
    reportSheet.getRange('A26').setFontWeight('bold').setBackground('#F44336').setFontColor('white');
    reportSheet.getRange('A27:E27').setFontWeight('bold').setBackground('#FFEBEE');

    reportSheet.autoResizeColumns(1, 5);

    return {
      success: true,
      message: `Report generated: ${sheetName}`,
      sheetName: sheetName
    };

  } catch (error) {
    console.error('Error exporting quarterly report:', error);
    return { success: false, message: error.toString() };
  }
}
