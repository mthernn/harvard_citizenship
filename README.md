# Harvard Citizenship Program Website

Repository name: `harvard_citizenship`  
GitHub Pages URL: `https://mthernn.github.io/harvard_citizenship/`

This package contains a GitHub Pages static website and a Google Apps Script backend for the Harvard Citizenship Program.

## What is included

- `index.html`: English website.
- `lang/`: complete static language pages using language endonyms in the directory names.
- `assets/`: CSS, JavaScript, images, icons, and partner logos.
- `apps_script/Code.gs`: Google Apps Script backend for registration, contact, and Harvard student interest forms.
- `.nojekyll`: ensures GitHub Pages serves all folders and files normally.

## Important fixes in this version

1. The student registration form no longer asks for availability.
2. Each non-English language option now routes to a full static page using the same website structure as the English homepage.
3. The Apps Script backend records student registrations into a Google Sheet, routes registrations to the correct partner tab, emails `citizenship@harvardiop.org`, and sends the student a confirmation email with the two-day follow-up message.

## Deploy the website to GitHub Pages

1. Create or open the GitHub repository named `harvard_citizenship` under `mthernn`.
2. Upload all files from this folder to the repository root.
3. Go to GitHub repository settings.
4. Open **Pages**.
5. Set source to the `main` branch and root directory.
6. The website should publish at:
   `https://mthernn.github.io/harvard_citizenship/`

## Set up the Google Sheet backend

Use the Google account that owns `citizenship@harvardiop.org`.

1. Create a Google Sheet for the website intake system.
2. Copy the Google Sheet ID from the URL.
3. Open `apps_script/Code.gs`.
4. Replace:
   `PASTE_GOOGLE_SHEET_ID_HERE`
   with the actual Sheet ID.
5. Go to `script.google.com` while logged into the `citizenship@harvardiop.org` Google account.
6. Create a new Apps Script project.
7. Paste the full contents of `apps_script/Code.gs` into `Code.gs`.
8. Deploy the script:
   - **Deploy** > **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
9. Copy the deployed Web App URL.
10. Open `assets/js/main.js`.
11. Replace:
   `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE`
   with the deployed Web App URL.
12. Commit and push the updated file to GitHub.

## Google Sheet tabs created automatically

The backend creates tabs automatically when submissions arrive. Tabs include:

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

## Form behavior

### Student registration

When a student registration is submitted:

- The submission is saved into the partner-specific Google Sheet tab.
- The status is set to `New`.
- The correct cohort window is automatically added:
  - July 1 to September 30: September cohort
  - October 1 to February 28: February cohort
  - March 1 to June 30: June cohort
- An email notification is sent to `citizenship@harvardiop.org`.
- A confirmation email is sent to the registrant’s email address.

### Contact form

When a contact inquiry is submitted:

- The submission is saved to `Contact Messages`.
- An email notification is sent to `citizenship@harvardiop.org`.

### Harvard student interest form

When a Harvard student interest form is submitted:

- The submission is saved to `Tutor Interest`.
- An email notification is sent to `citizenship@harvardiop.org`.
- The student receives a short confirmation email.

## Translation note

This package includes static translated pages in all 26 languages requested. Because the site includes legal, privacy, and program-access language, the translated pages should be reviewed by fluent speakers or professional translators before large-scale public outreach.
