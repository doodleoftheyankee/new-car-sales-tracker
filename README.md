# Buick GMC Sales Tracker - Google Apps Script

A comprehensive sales tracking system for Buick GMC dealerships, built with Google Apps Script and React. Track sales, manage customer data, analyze performance, and archive historical records - all within Google Sheets.

## Features ✨

- **📊 Live Dashboard**: Real-time sales metrics including total sales, revenue, profit, and brand breakdown
- **➕ Sale Entry**: Easy-to-use form for adding new sales with all relevant details
- **🔍 Advanced Search & Filter**: Search by customer, deal number, stock number, or filter by month
- **📈 Sales Management**: View, edit, and delete sales records
- **📦 Archive System**: Archive sales by month for better organization
- **💾 Import/Export**: CSV import and export functionality
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

2. **Copy the contents of `Code.gs`** from this repository and paste it into the Apps Script editor

3. **Add the HTML file**:
   - Click the **+** button next to "Files" in the left sidebar
   - Select **HTML**
   - Name it `index`
   - Copy the contents of `index.html` from this repository and paste it

4. **Add the project settings**:
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
