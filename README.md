# Harvard Citizenship Program Website

GitHub Pages repository: `harvard_citizenship`  
Expected URL: `https://mthernn.github.io/harvard_citizenship/`

## What changed in this final package

- Removed the availability field from student registration.
- Changed preferred language into a dropdown with all 26 supported languages.
- Replaced cohort language with plain-language match-window text, such as: “Register soon! Our next cohort of classes starts in September.”
- Moved Partners between Process and Confidentiality.
- Reordered the lower page: Registration, Leadership, Success Stories, Donations, Contact, FAQ.
- Reordered partner logos as requested.
- Replaced the static partner grid with an infinite logo carousel / moving logo wall.
- Added hover pause and monochrome-to-color hover behavior for partner logos.
- Added full language-specific pages under `/lang/` using discreet endonym directories.
- Updated Apps Script to send student, contact, and tutor-interest notifications to `citizenship@harvardiop.org` and send student confirmation emails.

## Apps Script setup

1. Create a Google Sheet in the `citizenship@harvardiop.org` Google account.
2. Copy the Sheet ID from the URL.
3. Go to `script.google.com`, create a new project, and paste `apps_script/Code.gs`.
4. Replace `PASTE_GOOGLE_SHEET_ID_HERE` with the Sheet ID.
5. Deploy as a Web App:
   - Execute as: Me
   - Who has access: Anyone
6. Copy the Web App URL.
7. In `assets/js/main.js`, replace `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web App URL.
8. Commit and push to GitHub.

## Google Sheet tabs automatically created

The script creates tabs as submissions arrive:

- Independent Referrals
- Harvard Bridge Program
- Harvard Immigration and Refugee Clinic
- Harvard Law School
- Harvard Kennedy School
- Harvard Institute of Politics
- Cambridge Community Learning Center
- Cambridge Commission on Immigrant Rights and Citizenship
- Boston Mayor's Office for Immigrant Advancement
- Law Offices of Beyanid Montoya-Sheehan
- Project Citizenship
- De Novo Center for Justice and Healing
- Contact Messages
- Tutor Interest

## Privacy and review note

The website does not ask for immigration status and does not upload documents. Translated pages are included for all 26 supported languages. For official public outreach, have fluent speakers review language pages before relying on them for legal or sensitive communication.
