/* Harvard Citizenship Program website backend
 * Deploy this script from the citizenship@harvardiop.org Google account.
 *
 * Setup:
 * 1. Create a Google Sheet in the citizenship@harvardiop.org account.
 * 2. Copy the Spreadsheet ID from the Sheet URL.
 * 3. Paste it into SPREADSHEET_ID below.
 * 4. Open script.google.com, create a new project, and paste this file into Code.gs.
 * 5. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Copy the deployed Web App URL and paste it into assets/js/main.js.
 */

const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const NOTIFICATION_EMAIL = 'citizenship@harvardiop.org';
const SENDER_NAME = 'Harvard Citizenship Program';

const PARTNER_TABS = [
  'Independent Referrals',
  'Harvard Bridge Program',
  'Harvard Immigration and Refugee Clinic',
  'Harvard Law School',
  'Cambridge Community Learning Center',
  'Cambridge Commission on Immigrant Rights and Citizenship',
  'Law Offices of Beyanid Montoya-Sheehan',
  'Project Citizenship',
  'De Novo Center for Justice and Healing',
  "Boston Mayor's Office for Immigrant Advancement",
  'Harvard Institute of Politics',
  'Harvard Kennedy School'
];

const STUDENT_HEADERS = [
  'Timestamp',
  'Status',
  'Cohort',
  'Partner',
  'Registrant Type',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Preferred Language',
  'Preferred Format',
  'Notes',
  'Page Language',
  'Page URL'
];

const CONTACT_HEADERS = [
  'Timestamp',
  'Status',
  'Inquiry Type',
  'First Name',
  'Last Name',
  'Email',
  'Message',
  'Page Language',
  'Page URL'
];

const TUTOR_HEADERS = [
  'Timestamp',
  'Status',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Class Year',
  'Language Skills',
  'Interests',
  'Page Language',
  'Page URL'
];

function doGet(e) {
  return json_({ ok: true, service: 'Harvard Citizenship Program' });
}

function doPost(e) {
  try {
    const data = e.parameter || {};
    const formType = data.formType || 'student_registration';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (formType === 'contact') {
      handleContact(ss, data);
    } else if (formType === 'tutor_interest') {
      handleTutorInterest(ss, data);
    } else {
      handleStudentRegistration(ss, data);
    }

    return json_({ ok: true });
  } catch (err) {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: 'Harvard Citizenship Program website error',
      htmlBody: '<p>' + escapeHtml_(err.stack || err.message || err) + '</p>',
      name: SENDER_NAME
    });
    return json_({ ok: false, error: String(err) });
  }
}

function handleStudentRegistration(ss, data) {
  const partner = cleanPartner_(data.partner);
  const sheet = ensureSheet_(ss, partner, STUDENT_HEADERS);
  const row = [
    new Date(),
    'New',
    data.cohort || '',
    partner,
    data.registrantType || '',
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.phone || '',
    data.preferredLanguage || '',
    data.preferredFormat || '',
    data.notes || '',
    data.pageLanguage || '',
    data.pageUrl || ''
  ];
  sheet.appendRow(row);

  const subject = 'New student registration: ' + fullName_(data);
  notifyDirectors_(subject, buildStudentHtml_(data, partner));

  if (data.email) {
    MailApp.sendEmail({
      to: data.email,
      subject: 'Thank you for registering with the Harvard Citizenship Program',
      htmlBody: confirmationHtml_(data),
      name: SENDER_NAME
    });
  }
}

function handleContact(ss, data) {
  const sheet = ensureSheet_(ss, 'Contact Messages', CONTACT_HEADERS);
  sheet.appendRow([
    new Date(),
    'New',
    data.inquiryType || '',
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.message || '',
    data.pageLanguage || '',
    data.pageUrl || ''
  ]);
  notifyDirectors_('New website inquiry: ' + (data.inquiryType || 'contact'), buildContactHtml_(data));
}

function handleTutorInterest(ss, data) {
  const sheet = ensureSheet_(ss, 'Tutor Interest', TUTOR_HEADERS);
  sheet.appendRow([
    new Date(),
    'New',
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.phone || '',
    data.classYear || '',
    data.languageSkills || '',
    data.interests || '',
    data.pageLanguage || '',
    data.pageUrl || ''
  ]);
  notifyDirectors_('New Harvard student interest: ' + fullName_(data), buildTutorHtml_(data));

  if (data.email) {
    MailApp.sendEmail({
      to: data.email,
      subject: 'Harvard Citizenship Program interest list',
      htmlBody: '<p>Thank you for your interest in the Harvard Citizenship Program. Harvard College students apply through the IOP Common Application. The Co-Directors will keep your information on the interest list and follow up when appropriate.</p><p>Harvard Citizenship Program</p>',
      name: SENDER_NAME
    });
  }
}

function cleanPartner_(partner) {
  if (PARTNER_TABS.indexOf(partner) !== -1) return partner;
  return 'Independent Referrals';
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#12233f')
      .setFontColor('#ffffff');
  }
  return sheet;
}

function notifyDirectors_(subject, htmlBody) {
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    htmlBody: htmlBody,
    name: SENDER_NAME
  });
}

function confirmationHtml_(data) {
  const name = data.firstName ? ' ' + escapeHtml_(data.firstName) : '';
  return '<p>Hello' + name + ',</p>' +
    '<p>Thank you for registering with the Harvard Citizenship Program. We are honored to support your journey toward U.S. citizenship.</p>' +
    '<p>Our Co-Directors will contact you within approximately two days to schedule your welcome meeting and discuss next steps.</p>' +
    '<p>Every service provided by the Harvard Citizenship Program is free.</p>' +
    '<p>Harvard Citizenship Program<br>citizenship@harvardiop.org</p>';
}

function buildStudentHtml_(d, partner) {
  return '<h2>New student registration</h2>' + table_({
    Name: fullName_(d),
    Email: d.email,
    Phone: d.phone,
    Partner: partner,
    Cohort: d.cohort,
    'Registrant type': d.registrantType,
    'Preferred language': d.preferredLanguage,
    'Preferred format': d.preferredFormat,
    Notes: d.notes,
    'Page language': d.pageLanguage,
    URL: d.pageUrl
  });
}

function buildContactHtml_(d) {
  return '<h2>New website inquiry</h2>' + table_({
    'Inquiry type': d.inquiryType,
    Name: fullName_(d),
    Email: d.email,
    Message: d.message,
    'Page language': d.pageLanguage,
    URL: d.pageUrl
  });
}

function buildTutorHtml_(d) {
  return '<h2>New Harvard student interest</h2>' + table_({
    Name: fullName_(d),
    Email: d.email,
    Phone: d.phone,
    'Class year': d.classYear,
    'Language skills': d.languageSkills,
    Interests: d.interests,
    'Page language': d.pageLanguage,
    URL: d.pageUrl
  });
}

function fullName_(d) {
  return [d.firstName || '', d.lastName || ''].join(' ').trim();
}

function table_(obj) {
  let rows = '';
  Object.keys(obj).forEach(function(k) {
    rows += '<tr><th style="text-align:left;padding:6px;border:1px solid #ddd">' + escapeHtml_(k) + '</th><td style="padding:6px;border:1px solid #ddd">' + escapeHtml_(obj[k] || '') + '</td></tr>';
  });
  return '<table style="border-collapse:collapse">' + rows + '</table>';
}

function escapeHtml_(s) {
  return String(s).replace(/[&<>"']/g, function(m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
