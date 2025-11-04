# QUICK FIX - AI and Analytics Not Showing

## The Problem
You don't see "Quarterly", "AI Insights", or "Settings" tabs in your tracker.

## The Cause
Your Google Apps Script doesn't have the updated files yet.

## The Solution (5 Minutes)

---

### What You Need to Update:

You need **3 files** in your Google Apps Script:

1. ✅ **index.html** - REPLACE with new version (adds the tabs)
2. ✅ **Analytics.gs** - ADD this new file (quarterly analysis)
3. ✅ **AI_Insights.gs** - ADD this new file (AI recommendations)

---

## Step-by-Step Fix

### 1. Open Apps Script
- Go to your spreadsheet
- Click **Extensions** → **Apps Script**

### 2. Update index.html
- Click `index.html` in left sidebar
- Press `Ctrl+A` (or `Cmd+A` on Mac) to select all
- Press `Delete` to delete everything
- Open `index.html` from your computer/repository
- Copy ALL the code
- Paste into Apps Script
- Press `Ctrl+S` to save

### 3. Add Analytics.gs
- Click **+** button next to "Files"
- Select **Script**
- Rename the new file to `Analytics`
- Delete the default code
- Open `Analytics.gs` from repository
- Copy ALL the code
- Paste into Apps Script
- Press `Ctrl+S` to save

### 4. Add AI_Insights.gs
- Click **+** button again
- Select **Script**
- Rename to `AI_Insights`
- Delete default code
- Open `AI_Insights.gs` from repository
- Copy ALL the code
- Paste into Apps Script
- Press `Ctrl+S` to save

### 5. Test It
- Close Apps Script editor
- Refresh your spreadsheet (press F5)
- Click **Sales Tracker** → **Open Tracker**
- You should now see 6 tabs:
  ```
  [Dashboard] [Sales] [Quarterly] [AI Insights] [Archive] [Settings]
  ```

---

## Verify It Worked

After deploying, you should see:

### 6 Navigation Tabs
- Dashboard ✓
- Sales ✓
- **Quarterly** ← NEW!
- **AI Insights** ← NEW!
- Archive ✓
- **Settings** ← NEW!

### Quarterly Tab Shows:
- Q1, Q2, Q3, Q4 cards
- Year selector
- Year-to-Date summary

### AI Insights Tab Shows:
- "Generate Insights" button
- Message about API key

### Settings Tab Shows:
- Gemini API Key field
- Dealership Context field

---

## Still Not Working?

### Run the Test Script:

1. Copy the file `TEST_DEPLOYMENT.gs` to Apps Script
2. Click **Run** → select `isDeploymentComplete`
3. It will tell you exactly what's missing

### Check Browser Console:

1. Press `F12` in your browser
2. Click **Console** tab
3. Look for any red error messages
4. Share those with me if you see them

---

## Common Mistakes

❌ **Mistake**: Only copying PART of the index.html file
✅ **Fix**: Make sure you select ALL and copy EVERYTHING

❌ **Mistake**: Not saving after pasting
✅ **Fix**: Always press Ctrl+S to save

❌ **Mistake**: Misspelling file names (Analytics vs Analytic)
✅ **Fix**: Use EXACT names: `Analytics` and `AI_Insights`

❌ **Mistake**: Not refreshing the spreadsheet after deploying
✅ **Fix**: Close Apps Script, refresh spreadsheet, reopen tracker

---

## File Checklist

After deployment, your Apps Script should have:

```
Files
├── Code.gs ✓ (already had this)
├── Analytics.gs ✓ (NEW - you added this)
├── AI_Insights.gs ✓ (NEW - you added this)
└── index.html ✓ (UPDATED - you replaced this)
```

If you have all 4 files, you're good to go!

---

## Next Steps After Deployment

Once you see the new tabs:

1. **Go to Settings tab**
2. **Get a Gemini API key** (free): https://makersuite.google.com/app/apikey
3. **Paste API key** in Settings
4. **Add dealership context** (copy from CONTEXT_FOR_SETTINGS.txt)
5. **Save**
6. **Go to AI Insights tab**
7. **Click "Generate Insights"**
8. **Get your first AI recommendations!**

---

## Need Help?

If you've followed these steps and still don't see the tabs:

1. Run `TEST_DEPLOYMENT.gs` script (see above)
2. Check browser console (F12) for errors
3. Verify all 4 files exist in Apps Script
4. Make sure file names are EXACTLY: `Analytics` and `AI_Insights`
5. Share any error messages you see

The code is working - we just need to get it deployed to your Google Apps Script! 🚀
