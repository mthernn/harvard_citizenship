# Harvard Citizenship Program Website

GitHub Pages-ready website for the Harvard Citizenship Program.

## Repository
`harvard_citizenship`

## Public URL
`https://mthernn.github.io/harvard_citizenship/`

## What is included

- Full static website built for GitHub Pages
- Main English landing page
- Discreet multilingual directory under `/lang/` with 26 language pages by endonym
- Custom student registration form
- Contact form
- Harvard student interest form
- Partner-logo referral flow
- Dynamic counters and responsive design
- Apps Script backend files for Google Sheets intake routing
- Normalized asset folder with provided photos and logos

## Connect the Apps Script backend

1. Create a Google Sheet for the program intake tracker.
2. Copy the Spreadsheet ID from the sheet URL.
3. Go to `script.google.com` and create a new Apps Script project.
4. Copy `apps_script/Code.gs` into the project.
5. Copy `apps_script/appsscript.json` into project settings if needed.
6. In `Code.gs`, replace `PASTE_GOOGLE_SHEET_ID_HERE` with the Google Sheet ID.
7. Deploy > New deployment > Web app.
   - Execute as: Me
   - Who has access: Anyone
8. Copy the deployed Web App URL.
9. In `assets/js/main.js`, replace `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
10. Commit and push to GitHub Pages.

## Google Sheet tabs created by the backend

- Independent Referrals
- Harvard Bridge Program
- Harvard Immigration and Refugee Clinic
- Harvard Law School
- Cambridge Community Learning Center
- Cambridge Commission on Immigrant Rights and Citizenship
- Law Offices of Beyanid Montoya-Sheehan
- Project Citizenship
- De Novo Center for Justice and Healing
- Boston Mayor's Office for Immigrant Advancement
- Harvard Institute of Politics
- Harvard Kennedy School
- Contact Messages
- Tutor Interest

## Important privacy note

The student registration form does not ask for immigration status and does not accept document uploads.

## Translation note

The multilingual pages are included as a complete first website version. Because some languages involve legal and privacy-sensitive wording, final review by fluent speakers is recommended before large-scale outreach in those languages.
