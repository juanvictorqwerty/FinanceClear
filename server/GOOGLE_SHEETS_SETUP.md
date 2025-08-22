# Google Sheets API Integration Setup

This guide will help you set up Google Sheets API integration for your FiClear application.

## Prerequisites

- Google Cloud Platform account
- Node.js application with googleapis package installed (already done)

## Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Create a new project or select an existing one
   - Note down your project ID

3. **Enable Google Sheets API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

4. **Enable Google Drive API (Optional but Recommended)**
   - Search for "Google Drive API"
   - Click on it and press "Enable"
   - This allows creating new spreadsheets

## Step 2: Create Service Account

1. **Go to Credentials**
   - Navigate to "APIs & Services" > "Credentials"

2. **Create Service Account**
   - Click "Create Credentials" > "Service Account"
   - Enter a name (e.g., "ficlear-sheets-service")
   - Enter description (e.g., "Service account for FiClear Google Sheets integration")
   - Click "Create and Continue"

3. **Grant Permissions (Optional)**
   - You can skip this step for now
   - Click "Continue" then "Done"

4. **Create and Download Key**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Select "JSON" format
   - Download the JSON file
   - **Keep this file secure and never commit it to version control**

## Step 3: Configure Environment Variables

Choose one of the following methods:

### Method 1: Key File Path (Recommended for Development)

1. Place the downloaded JSON file in a secure location (outside your project directory)
2. Add to your `.env` file:
```env
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=/path/to/your/service-account-key.json
```

### Method 2: Credentials as Environment Variable (Recommended for Production)

1. Open the downloaded JSON file
2. Copy the entire content
3. Add to your `.env` file:
```env
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project",...}
```

## Step 4: Share Spreadsheets with Service Account

For the service account to access your Google Sheets:

1. **Get Service Account Email**
   - From the JSON file, find the `client_email` field
   - It looks like: `your-service-account@your-project.iam.gserviceaccount.com`

2. **Share Your Spreadsheet**
   - Open your Google Sheet
   - Click "Share" button
   - Add the service account email
   - Give it "Editor" permissions
   - Uncheck "Notify people" (since it's a service account)
   - Click "Share"

## Step 5: Test the Integration

1. **Start your server**
```bash
cd server
npm start
```

2. **Test with a simple API call**
```bash
# Get spreadsheet info
curl -X GET "http://localhost:5000/api/sheets/info/YOUR_SPREADSHEET_ID"

# Read data from a sheet
curl -X POST "http://localhost:5000/api/sheets/read" \
  -H "Content-Type: application/json" \
  -d '{
    "spreadsheetId": "YOUR_SPREADSHEET_ID",
    "range": "Sheet1!A1:D10"
  }'
```

## API Endpoints

### Read Data
```http
POST /api/sheets/read
Content-Type: application/json

{
  "spreadsheetId": "your_spreadsheet_id",
  "range": "Sheet1!A1:D10"
}
```

### Write Data
```http
POST /api/sheets/write
Content-Type: application/json

{
  "spreadsheetId": "your_spreadsheet_id",
  "range": "Sheet1!A1",
  "values": [
    ["Name", "Email", "Age"],
    ["John Doe", "john@example.com", "30"]
  ]
}
```

### Append Data
```http
POST /api/sheets/append
Content-Type: application/json

{
  "spreadsheetId": "your_spreadsheet_id",
  "range": "Sheet1!A:C",
  "values": [
    ["Jane Doe", "jane@example.com", "25"]
  ]
}
```

### Get Spreadsheet Info
```http
GET /api/sheets/info/{spreadsheetId}
```

### Create New Spreadsheet
```http
POST /api/sheets/create
Content-Type: application/json

{
  "title": "My New Spreadsheet",
  "sheetTitles": ["Sheet1", "Data", "Reports"]
}
```

## Security Best Practices

1. **Never commit credentials to version control**
   - Add `.env` to your `.gitignore`
   - Use environment variables for production

2. **Limit service account permissions**
   - Only grant necessary permissions
   - Use specific spreadsheet sharing instead of broad access

3. **Rotate credentials regularly**
   - Generate new service account keys periodically
   - Delete old keys from Google Cloud Console

4. **Monitor API usage**
   - Check Google Cloud Console for API usage
   - Set up quotas and alerts

## Troubleshooting

### Common Issues

1. **"The caller does not have permission"**
   - Make sure you've shared the spreadsheet with the service account email
   - Check that the service account has the correct permissions

2. **"Unable to parse range"**
   - Ensure range format is correct (e.g., "Sheet1!A1:D10")
   - Sheet names with spaces need to be quoted (e.g., "'My Sheet'!A1:D10")

3. **"Requested entity was not found"**
   - Check that the spreadsheet ID is correct
   - Ensure the spreadsheet exists and is accessible

4. **Authentication errors**
   - Verify environment variables are set correctly
   - Check that the JSON credentials are valid
   - Ensure the service account key hasn't been deleted

### Getting Spreadsheet ID

The spreadsheet ID is found in the URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
```

You can also use the helper function:
```javascript
import { extractSpreadsheetId } from './config/googleSheets.js';
const id = extractSpreadsheetId('https://docs.google.com/spreadsheets/d/abc123/edit');
```

## Next Steps

1. Integrate the API endpoints into your frontend
2. Add authentication middleware to protect the endpoints
3. Implement error handling and logging
4. Add data validation for your specific use cases
5. Consider implementing caching for frequently accessed data
