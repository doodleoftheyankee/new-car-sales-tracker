# Buick GMC Sales Tracker - Google Apps Script

A comprehensive sales tracking system for Buick GMC dealerships, built with Google Apps Script and React. Track sales, manage customer data, analyze performance, and archive historical records - all within Google Sheets.

## Features ✨

- **📊 Live Dashboard**: Real-time sales metrics including total sales, revenue, profit, and brand breakdown
- **➕ Sale Entry**: Easy-to-use form for adding new sales with all relevant details
- **🔍 Advanced Search & Filter**: Search by customer, deal number, stock number, or filter by month
- **📈 Sales Management**: View, edit, and delete sales records
- **📦 Archive System**: Archive sales by month for better organization
- **💾 Import/Export**: CSV import and export functionality
- **📊 Quarterly Analytics**: Advanced quarterly analysis with year-over-year comparisons
- **🤖 AI-Powered Insights**: Get smart recommendations using Google Gemini AI
- **💡 Strategic Recommendations**: AI analyzes your data and provides actionable advice
- **📈 Trend Analysis**: Identify patterns and performance trends
- **👥 Sales Team Analytics**: Track individual and team performance
- **🎯 F&I Penetration Analysis**: Monitor financing, warranty, and insurance rates
- **📄 Document Management**: Upload dealership documents for AI context
- **🎨 Beautiful UI**: Modern, responsive design using Tailwind CSS
- **☁️ Cloud Storage**: All data stored in Google Sheets - accessible anywhere

## Installation 🚀

### Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Buick GMC Sales Tracker" (or any name you prefer)

### Step 2: Open Apps Script Editor

1. In your spreadsheet, click **Extensions** → **Apps Script**
2. This will open the Apps Script editor in a new tab

### Step 3: Add the Code Files

1. **Delete** the default `Code.gs` file content

2. **Add Code.gs**:
   - Copy the contents of `Code.gs` from this repository
   - Paste into the Apps Script editor

3. **Add Analytics.gs**:
   - Click the **+** button next to "Files" in the left sidebar
   - Select **Script**
   - Name it `Analytics`
   - Copy the contents of `Analytics.gs` from this repository and paste it

4. **Add AI_Insights.gs**:
   - Click the **+** button next to "Files"
   - Select **Script**
   - Name it `AI_Insights`
   - Copy the contents of `AI_Insights.gs` from this repository and paste it

5. **Add the HTML file**:
   - Click the **+** button next to "Files" in the left sidebar
   - Select **HTML**
   - Name it `index`
   - Copy the contents of `index.html` from this repository and paste it

6. **Add the project settings**:
   - Click on **Project Settings** (gear icon) in the left sidebar
   - Scroll down to "Script Properties"
   - The `appsscript.json` settings are optional but recommended for timezone configuration

### Step 4: Save and Deploy

1. Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`
2. Name your project (e.g., "Buick GMC Sales Tracker")
3. Click **Run** → select `onOpen` from the dropdown
4. Click the **Run** button
5. **Authorize the script**:
   - A dialog will appear asking for permissions
   - Click **Review Permissions**
   - Select your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**

### Step 5: Initialize the System

1. Close the Apps Script editor and return to your spreadsheet
2. Refresh the page
3. You should see a new menu called **"Sales Tracker"** in the menu bar
4. Click **Sales Tracker** → **Initialize Sheets**
5. Click **Sales Tracker** → **Open Tracker**

🎉 **You're all set!** The sales tracker should now open in a modal dialog.

## Usage 📖

### Adding a Sale

1. Click **Sales Tracker** → **Open Tracker** from the menu
2. Navigate to the **Sales** tab
3. Click the **+ Add New Deal** button
4. Fill in the form with all sale details:
   - Date, Deal Number, Stock Number
   - Vehicle information (Make, Model, Year)
   - Customer information
   - Financial details
   - F&I products (Financing, Warranty, Insurance)
5. Click **Save Deal**

### Viewing the Dashboard

The Dashboard provides a quick overview:
- **Total Sales This Month**: Number of vehicles sold
- **Total Revenue**: Sum of all sale prices
- **Total Profit**: Combined front-end and back-end profit
- **Buick / GMC**: Brand breakdown
- **Recent Sales**: Latest 5 transactions

### Managing Sales

In the **Sales** tab:
- **Search**: Use the search bar to find deals by customer name, deal number, stock number, model, or sales person
- **Filter by Month**: Select a specific month to view sales
- **Edit**: Click the edit icon (✏️) to modify a sale
- **Delete**: Click the trash icon (🗑️) to remove a sale

### Archiving Sales

1. Go to the **Archive** tab
2. Select a month using the month picker
3. Confirm the archive operation
4. Archived sales are moved to a separate sheet and removed from active sales

### Using Quarterly Analytics

1. Go to the **Quarterly** tab
2. View performance breakdown by quarter (Q1, Q2, Q3, Q4)
3. See year-to-date totals and metrics
4. Compare quarters side-by-side
5. Click the 💡 icon on any quarter to get AI insights
6. Use year navigation to view previous years
7. Each quarter shows:
   - Total sales count
   - Revenue and profit
   - Average profit per sale
   - Profit margin percentage
   - Buick vs GMC breakdown

### AI-Powered Insights

The AI Insights feature uses Google Gemini to analyze your sales data and provide strategic recommendations.

**Setup:**
1. Go to **Settings** tab
2. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Enter your API key and save
4. (Optional) Add dealership context for better insights

**Using AI Insights:**
1. Go to **AI Insights** tab
2. Click "Generate Insights" button
3. Wait for AI analysis (takes 10-30 seconds)
4. Review detailed recommendations including:
   - Performance assessment
   - Specific improvement strategies
   - F&I penetration opportunities
   - Sales team training suggestions
   - Market positioning advice

**Quarterly AI Analysis:**
1. Go to **Quarterly** tab
2. Click the 💡 lightbulb icon on any quarter
3. Get quarter-specific insights and recommendations

### Dealership Context

Improve AI recommendations by providing context about your dealership:

1. Go to **Settings** tab
2. In "Dealership Context" section, describe:
   - Location and market size
   - Dealership size and sales volume goals
   - Current challenges or focus areas
   - Special programs or initiatives
   - Competitive landscape
3. Click "Save Context"
4. AI will use this information for more relevant recommendations

### Importing/Exporting Data

**Export:**
1. Go to the **Sales** tab
2. Filter the data as needed
3. Click the **Export** button
4. A CSV file will be downloaded

**Import:**
1. Go to the **Sales** tab
2. Click the **Import CSV** button
3. Select a CSV file with the correct format
4. Confirm the import

### CSV Format

The CSV file should have these columns in order:
```
Date, Deal Number, Stock Number, Make, Model, Year, Customer Name, Lead Type, Sales Person, Trade In, Trade In Value, Sale Price, Front End Profit, Back End Profit, Total Profit, Financing, Warranty, Insurance, Notes
```

## Data Structure 📋

All sales data is stored in the "Sales Data" sheet with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| ID | Number | Unique identifier |
| Date | Date | Sale date |
| Deal Number | Text | Dealership deal number |
| Stock Number | Text | Vehicle stock number |
| Make | Text | Vehicle make (Buick/GMC) |
| Model | Text | Vehicle model |
| Year | Number | Vehicle year |
| Customer Name | Text | Customer full name |
| Lead Type | Text | How customer found dealership |
| Sales Person | Text | Sales representative name |
| Trade In | Boolean | Whether customer had trade-in |
| Trade In Value | Number | Value of trade-in |
| Sale Price | Number | Final sale price |
| Front End Profit | Number | Profit from vehicle sale |
| Back End Profit | Number | Profit from F&I products |
| Total Profit | Number | Front + Back end profit |
| Financing | Boolean | Financing product sold |
| Warranty | Boolean | Warranty product sold |
| Insurance | Boolean | Insurance product sold |
| Notes | Text | Additional notes |
| Created At | Timestamp | When record was created |

## Customization 🎨

### Adding More Sales People

Edit the `Code.gs` file and add names to the sales person dropdown in the form (around line 630 in index.html).

### Changing Models

Update the Buick and GMC model lists in the form (around line 573-578 in index.html).

### Modifying the Dashboard

Dashboard metrics are calculated in the `DashboardView` function (around line 279-353 in index.html).

## What AI Insights Can Tell You 🤖

The AI analysis provides:

**Performance Insights:**
- Whether you're on track for goals
- Strong and weak performance areas
- Comparison to typical dealership metrics

**F&I Opportunities:**
- Which products have low penetration
- Strategies to improve F&I sales
- Training focus areas for sales team

**Sales Team Analysis:**
- Top performer characteristics
- Coaching opportunities for underperformers
- Lead source optimization

**Strategic Recommendations:**
- Specific actions to improve next quarter
- Inventory and product mix suggestions
- Marketing and lead generation ideas
- Pricing and profit optimization tips

**Trend Analysis:**
- Seasonal patterns
- Growth or decline indicators
- Brand performance (Buick vs GMC)

## Advanced Features 🎯

### Quarterly Reports

Export detailed quarterly reports:
1. Open Apps Script editor
2. Run `exportQuarterlyReport(year, 'Q1')`
3. A new sheet will be created with detailed metrics

### Comparative Analysis

Get quarter-over-quarter comparisons:
- Growth percentages
- Performance trends
- Sales velocity changes

### Sales Person Performance

Analyze individual performance:
1. In Apps Script, run `analyzeSalesPersonPerformance("Name")`
2. Get detailed individual metrics and AI recommendations

## Troubleshooting 🔧

### "Sheet not found" error
- Run **Sales Tracker** → **Initialize Sheets** from the menu

### Data not loading
- Check that you've authorized the script
- Refresh the spreadsheet page
- Check browser console for errors (F12)

### Import not working
- Ensure CSV format matches the required structure
- Check that there are no special characters causing parsing issues

### Script execution timeout
- Large datasets may timeout
- Consider archiving old data
- Contact support if issue persists

### AI Insights not working

**"API key not configured" error:**
- Go to Settings tab
- Add your Gemini API key
- Get free key at: https://makersuite.google.com/app/apikey

**AI returns generic advice:**
- Add dealership context in Settings
- Ensure you have sufficient sales data (at least 10 sales)
- Try generating insights for completed quarters

**Slow AI response:**
- Normal processing time is 10-30 seconds
- Large datasets may take longer
- Check your internet connection

**API quota exceeded:**
- Gemini free tier has daily limits
- Wait 24 hours or upgrade your API plan
- Monitor usage at Google AI Studio

## Security & Privacy 🔒

- All data is stored in your Google Sheets - you maintain full control
- The script runs under your Google account permissions
- No data is sent to external servers
- Share the spreadsheet only with trusted team members

## Support 💬

For issues, questions, or feature requests:
1. Check this README first
2. Review the code comments
3. Open an issue on GitHub
4. Contact your development team

## License 📄

This project is provided as-is for use in automotive dealership sales tracking.

---

**Built with ❤️ for Buick GMC Dealerships**
