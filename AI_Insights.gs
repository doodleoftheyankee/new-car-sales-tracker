/**
 * AI_Insights.gs - Gemini AI Integration for Smart Insights
 * Provides AI-powered recommendations and analysis
 */

// Configuration - User must add their Gemini API key in Script Properties
const GEMINI_API_KEY_PROPERTY = 'GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Get or set Gemini API Key
 */
function setGeminiApiKey(apiKey) {
  PropertiesService.getScriptProperties().setProperty(GEMINI_API_KEY_PROPERTY, apiKey);
  return { success: true, message: 'API key saved successfully' };
}

function getGeminiApiKey() {
  return PropertiesService.getScriptProperties().getProperty(GEMINI_API_KEY_PROPERTY);
}

function hasGeminiApiKey() {
  return getGeminiApiKey() !== null;
}

/**
 * Generate AI insights for quarterly data
 */
function generateQuarterlyInsights(year, quarter) {
  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return {
        success: false,
        message: 'Please configure your Gemini API key first. Go to Settings to add it.'
      };
    }

    // Get quarterly analysis
    const analysis = getQuarterlyAnalysis(year);
    const quarterData = analysis.quarters[quarter];
    const comparative = getComparativeAnalysis(year);

    // Get dealership context documents
    const dealershipContext = getDealershipContext();

    // Build prompt for Gemini
    const prompt = buildQuarterlyInsightPrompt(quarterData, comparative, dealershipContext, year, quarter);

    // Call Gemini API
    const insights = callGeminiAPI(prompt, apiKey);

    return {
      success: true,
      insights: insights,
      quarter: quarter,
      year: year,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating insights:', error);
    return {
      success: false,
      message: error.toString()
    };
  }
}

/**
 * Generate AI recommendations based on current performance
 */
function generateRecommendations() {
  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return {
        success: false,
        message: 'Please configure your Gemini API key first.'
      };
    }

    // Get current data
    const currentYear = new Date().getFullYear();
    const currentQuarter = `Q${Math.floor(new Date().getMonth() / 3) + 1}`;
    const analysis = getQuarterlyAnalysis(currentYear);
    const trends = getTrendAnalysis(6);
    const dealershipContext = getDealershipContext();

    // Build prompt
    const prompt = buildRecommendationPrompt(analysis, trends, dealershipContext);

    // Call Gemini API
    const recommendations = callGeminiAPI(prompt, apiKey);

    return {
      success: true,
      recommendations: recommendations,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      success: false,
      message: error.toString()
    };
  }
}

/**
 * Analyze specific sales person performance
 */
function analyzeSalesPersonPerformance(salesPersonName) {
  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return { success: false, message: 'API key not configured' };
    }

    // Get all sales for this person
    const allSales = getAllSalesData();
    const personSales = allSales.filter(s => s.salesPerson === salesPersonName);

    if (personSales.length === 0) {
      return { success: false, message: 'No sales found for this person' };
    }

    // Calculate metrics
    const metrics = {
      totalSales: personSales.length,
      totalRevenue: personSales.reduce((sum, s) => sum + parseFloat(s.salePrice || 0), 0),
      totalProfit: personSales.reduce((sum, s) => sum + parseFloat(s.totalProfit || 0), 0),
      avgProfit: 0,
      fAndIPenetration: {
        financing: personSales.filter(s => s.financing).length,
        warranty: personSales.filter(s => s.warranty).length,
        insurance: personSales.filter(s => s.insurance).length
      },
      leadSourceBreakdown: {}
    };

    metrics.avgProfit = metrics.totalSales > 0 ? metrics.totalProfit / metrics.totalSales : 0;

    // Lead sources
    personSales.forEach(s => {
      metrics.leadSourceBreakdown[s.leadType] = (metrics.leadSourceBreakdown[s.leadType] || 0) + 1;
    });

    const prompt = `As a sales performance analyst for an automotive dealership, analyze this sales person's performance and provide specific, actionable recommendations:

Sales Person: ${salesPersonName}

Performance Metrics:
- Total Sales: ${metrics.totalSales}
- Total Revenue: $${metrics.totalRevenue.toFixed(2)}
- Total Profit: $${metrics.totalProfit.toFixed(2)}
- Average Profit per Sale: $${metrics.avgProfit.toFixed(2)}

F&I Product Penetration:
- Financing: ${metrics.fAndIPenetration.financing} sales (${((metrics.fAndIPenetration.financing / metrics.totalSales) * 100).toFixed(1)}%)
- Warranty: ${metrics.fAndIPenetration.warranty} sales (${((metrics.fAndIPenetration.warranty / metrics.totalSales) * 100).toFixed(1)}%)
- Insurance: ${metrics.fAndIPenetration.insurance} sales (${((metrics.fAndIPenetration.insurance / metrics.totalSales) * 100).toFixed(1)}%)

Lead Source Breakdown:
${Object.entries(metrics.leadSourceBreakdown).map(([source, count]) => `- ${source}: ${count} (${((count / metrics.totalSales) * 100).toFixed(1)}%)`).join('\n')}

Provide:
1. Performance assessment (strengths and areas for improvement)
2. Specific recommendations to increase sales
3. F&I product training suggestions
4. Lead source optimization advice`;

    const analysis = callGeminiAPI(prompt, apiKey);

    return {
      success: true,
      salesPerson: salesPersonName,
      metrics: metrics,
      analysis: analysis,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error analyzing sales person:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Build prompt for quarterly insights
 */
function buildQuarterlyInsightPrompt(quarterData, comparative, context, year, quarter) {
  let prompt = `You are an expert automotive dealership business analyst specializing in Buick and GMC sales. Analyze the following quarterly performance data and provide detailed, actionable insights.

QUARTER: ${quarter} ${year}

DEALERSHIP CONTEXT:
${context}

PERFORMANCE METRICS:
- Total Sales: ${quarterData.totalSales}
- Total Revenue: $${quarterData.totalRevenue.toFixed(2)}
- Total Profit: $${quarterData.totalProfit.toFixed(2)}
- Average Sale Price: $${quarterData.avgSalePrice.toFixed(2)}
- Average Profit per Sale: $${quarterData.avgProfit.toFixed(2)}
- Profit Margin: ${quarterData.profitMargin.toFixed(2)}%

BRAND BREAKDOWN:
- Buick: ${quarterData.buickSales} sales
- GMC: ${quarterData.gmcSales} sales

F&I PENETRATION RATES:
- Financing: ${quarterData.fAndI.financingRate.toFixed(1)}%
- Warranty: ${quarterData.fAndI.warrantyRate.toFixed(1)}%
- Insurance: ${quarterData.fAndI.insuranceRate.toFixed(1)}%

TRADE-IN METRICS:
- Trade Rate: ${quarterData.trades.tradeRate.toFixed(1)}%
- Average Trade Value: $${quarterData.trades.avgValue.toFixed(2)}

TOP PERFORMERS:
${quarterData.topPerformers.map((p, i) => `${i + 1}. ${p.name}: ${p.sales} sales, $${p.profit.toFixed(2)} profit`).join('\n')}

LEAD SOURCES:
${Object.entries(quarterData.leadSources).map(([source, count]) => `- ${source}: ${count}`).join('\n')}

Please provide:
1. **Overall Performance Assessment**: How did this quarter perform?
2. **Key Strengths**: What went well?
3. **Areas for Improvement**: What needs attention?
4. **F&I Opportunities**: How can we improve F&I penetration?
5. **Sales Team Insights**: What do the top performers do differently?
6. **Strategic Recommendations**: 3-5 specific actions to improve next quarter
7. **Market Considerations**: Insights about Buick vs GMC performance

Format your response in clear sections with bullet points for easy reading.`;

  return prompt;
}

/**
 * Build prompt for general recommendations
 */
function buildRecommendationPrompt(analysis, trends, context) {
  const currentQuarter = `Q${Math.floor(new Date().getMonth() / 3) + 1}`;
  const ytd = analysis.yearToDate;

  let prompt = `You are an expert automotive sales consultant for Buick and GMC dealerships. Based on the current performance data and trends, provide strategic recommendations.

DEALERSHIP CONTEXT:
${context}

YEAR-TO-DATE PERFORMANCE:
- Total Sales: ${ytd.totalSales}
- Total Revenue: $${ytd.totalRevenue.toFixed(2)}
- Total Profit: $${ytd.totalProfit.toFixed(2)}
- Average Profit: $${ytd.avgProfit.toFixed(2)}
- Profit Margin: ${ytd.profitMargin.toFixed(2)}%

CURRENT QUARTER (${currentQuarter}):
- Sales: ${analysis.quarters[currentQuarter].totalSales}
- Revenue: $${analysis.quarters[currentQuarter].totalRevenue.toFixed(2)}
- Profit: $${analysis.quarters[currentQuarter].totalProfit.toFixed(2)}

TREND: ${trends.trend}

F&I CURRENT RATES:
- Financing: ${ytd.fAndI.financingRate.toFixed(1)}%
- Warranty: ${ytd.fAndI.warrantyRate.toFixed(1)}%
- Insurance: ${ytd.fAndI.insuranceRate.toFixed(1)}%

Provide specific, actionable recommendations in these areas:
1. **Immediate Actions** (Next 30 days)
2. **Sales Process Improvements**
3. **F&I Enhancement Strategies**
4. **Marketing and Lead Generation**
5. **Team Training Priorities**
6. **Inventory and Product Mix Suggestions**

Be specific and tactical. Focus on actions that can increase profit and sales volume.`;

  return prompt;
}

/**
 * Call Gemini API
 */
function callGeminiAPI(prompt, apiKey) {
  try {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`API Error: ${responseCode} - ${response.getContentText()}`);
    }

    const result = JSON.parse(response.getContentText());

    if (result.candidates && result.candidates.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response generated from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

/**
 * Get dealership context from uploaded documents
 */
function getDealershipContext() {
  const contextDoc = getContextDocument();

  if (contextDoc) {
    return contextDoc.content;
  }

  return `Standard Buick GMC dealership. No additional context provided.`;
}

/**
 * Get context document from script properties
 */
function getContextDocument() {
  const contextStr = PropertiesService.getScriptProperties().getProperty('DEALERSHIP_CONTEXT');
  if (contextStr) {
    return JSON.parse(contextStr);
  }
  return null;
}

/**
 * Save dealership context
 */
function saveDealershipContext(contextData) {
  try {
    PropertiesService.getScriptProperties().setProperty('DEALERSHIP_CONTEXT', JSON.stringify({
      content: contextData,
      updatedAt: new Date().toISOString()
    }));

    return { success: true, message: 'Dealership context saved successfully' };
  } catch (error) {
    console.error('Error saving context:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Upload document to Google Drive and extract text
 */
function uploadDealershipDocument(base64Data, filename, mimeType) {
  try {
    // Create folder if doesn't exist
    const folderName = 'Sales Tracker Documents';
    let folder = getFolderByName(folderName);

    if (!folder) {
      folder = DriveApp.createFolder(folderName);
    }

    // Decode base64 and create file
    const data = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(data, mimeType, filename);
    const file = folder.createFile(blob);

    // Extract text content if possible
    let textContent = '';
    if (mimeType.includes('text') || filename.endsWith('.txt')) {
      textContent = blob.getDataAsString();
    } else if (filename.endsWith('.pdf')) {
      // For PDFs, we'll store the file info but can't extract text without additional libraries
      textContent = `PDF Document uploaded: ${filename}. Contains dealership information.`;
    }

    // Save document info
    const docInfo = {
      id: file.getId(),
      name: filename,
      url: file.getUrl(),
      uploadedAt: new Date().toISOString(),
      textContent: textContent
    };

    // Get existing documents
    const docsStr = PropertiesService.getScriptProperties().getProperty('DEALERSHIP_DOCUMENTS');
    const docs = docsStr ? JSON.parse(docsStr) : [];
    docs.push(docInfo);

    PropertiesService.getScriptProperties().setProperty('DEALERSHIP_DOCUMENTS', JSON.stringify(docs));

    return {
      success: true,
      message: `Document "${filename}" uploaded successfully`,
      fileId: file.getId(),
      fileUrl: file.getUrl()
    };

  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Get uploaded documents list
 */
function getUploadedDocuments() {
  const docsStr = PropertiesService.getScriptProperties().getProperty('DEALERSHIP_DOCUMENTS');
  return docsStr ? JSON.parse(docsStr) : [];
}

/**
 * Delete uploaded document
 */
function deleteUploadedDocument(fileId) {
  try {
    // Delete from Drive
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);

    // Remove from list
    const docsStr = PropertiesService.getScriptProperties().getProperty('DEALERSHIP_DOCUMENTS');
    let docs = docsStr ? JSON.parse(docsStr) : [];
    docs = docs.filter(d => d.id !== fileId);

    PropertiesService.getScriptProperties().setProperty('DEALERSHIP_DOCUMENTS', JSON.stringify(docs));

    return { success: true, message: 'Document deleted successfully' };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Helper function to find folder by name
 */
function getFolderByName(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : null;
}

/**
 * Generate comprehensive business review
 */
function generateBusinessReview(year) {
  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return { success: false, message: 'API key not configured' };
    }

    const analysis = getQuarterlyAnalysis(year);
    const comparative = getComparativeAnalysis(year);
    const trends = getTrendAnalysis(12);
    const context = getDealershipContext();

    const prompt = `You are a senior automotive dealership consultant. Create a comprehensive annual business review for this Buick GMC dealership.

DEALERSHIP CONTEXT:
${context}

ANNUAL PERFORMANCE (${year}):
- Total YTD Sales: ${analysis.yearToDate.totalSales}
- Total YTD Revenue: $${analysis.yearToDate.totalRevenue.toFixed(2)}
- Total YTD Profit: $${analysis.yearToDate.totalProfit.toFixed(2)}
- YTD Profit Margin: ${analysis.yearToDate.profitMargin.toFixed(2)}%

QUARTERLY BREAKDOWN:
${Object.entries(analysis.quarters).map(([q, data]) => `
${q}: ${data.totalSales} sales, $${data.totalRevenue.toFixed(2)} revenue, $${data.totalProfit.toFixed(2)} profit`).join('\n')}

TREND: ${trends.trend}

Create a comprehensive review with:
1. **Executive Summary**: Key highlights and lowlights
2. **Financial Performance Analysis**: Revenue and profit trends
3. **Sales Volume Analysis**: Quarterly progression
4. **Brand Performance**: Buick vs GMC analysis
5. **F&I Performance**: Product penetration analysis
6. **Sales Team Performance**: Top performers and opportunities
7. **Strategic Recommendations for Next Year**:
   - Short-term priorities (Q1)
   - Long-term goals (Full year)
   - Specific improvement targets
8. **Action Plan**: Concrete steps with timeline

Format as a professional business review document.`;

    const review = callGeminiAPI(prompt, apiKey);

    return {
      success: true,
      review: review,
      year: year,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating business review:', error);
    return { success: false, message: error.toString() };
  }
}
