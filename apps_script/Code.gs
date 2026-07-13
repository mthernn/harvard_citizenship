
/* Harvard Citizenship Program website backend
 * Deploy as Web App:
 * 1. Open script.google.com and create a new Apps Script project.
 * 2. Paste this file into Code.gs.
 * 3. Create or open a Google Sheet for intake. Copy the Spreadsheet ID from the URL.
 * 4. Put that ID into SPREADSHEET_ID below.
 * 5. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * 6. Copy the Web App URL into assets/js/main.js as APPS_SCRIPT_URL.
 */
const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const NOTIFICATION_EMAIL = 'citizenship@harvardiop.org';
const SENDER_NAME = 'Harvard Citizenship Program';

const PARTNER_TABS = [
  'Independent Referrals',
  'Harvard Bridge Program',
  'Harvard Immigration and Refugee Clinic',
  'Harvard Law School',
  'Harvard Kennedy School',
  'Harvard Institute of Politics',
  'Cambridge Community Learning Center',
  'Cambridge Commission on Immigrant Rights and Citizenship',
  "Boston Mayor's Office for Immigrant Advancement",
  'Law Offices of Beyanid Montoya-Sheehan',
  'Project Citizenship',
  'De Novo Center for Justice and Healing'
];

const STUDENT_HEADERS = [
  'Timestamp','Status','Cohort / Match Window','Partner','Registrant Type','First Name','Last Name','Email','Phone','Preferred Language','Preferred Format','Notes','Page Language','Page URL'
];
const CONTACT_HEADERS = ['Timestamp','Status','Inquiry Type','First Name','Last Name','Email','Message','Page Language','Page URL'];
const TUTOR_HEADERS = ['Timestamp','Status','First Name','Last Name','Email','Phone','Class Year','Language Skills','Interests','Page Language','Page URL'];

function doGet(e){
  return ContentService.createTextOutput(JSON.stringify({ok:true, service:'Harvard Citizenship Program'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try{
    const data = e.parameter || {};
    const formType = data.formType || 'student_registration';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if(formType === 'contact') handleContact(ss, data);
    else if(formType === 'tutor_interest') handleTutorInterest(ss, data);
    else handleStudentRegistration(ss, data);
    return json_({ok:true});
  }catch(err){
    MailApp.sendEmail({to: NOTIFICATION_EMAIL, subject:'Harvard Citizenship Program website error', htmlBody: '<p>'+escapeHtml_(err.stack || err.message)+'</p>', name:SENDER_NAME});
    return json_({ok:false, error:String(err)});
  }
}

function handleStudentRegistration(ss, data){
  const partner = cleanPartner_(data.partner);
  const sheet = ensureSheet_(ss, partner, STUDENT_HEADERS);
  const row = [new Date(),'New',data.cohort || '',partner,data.registrantType || '',data.firstName || '',data.lastName || '',data.email || '',data.phone || '',data.preferredLanguage || '',data.preferredFormat || '',data.notes || '',data.pageLanguage || '',data.pageUrl || ''];
  sheet.appendRow(row);
  notifyDirectors_('New student registration: '+fullName_(data), buildStudentHtml_(data, partner));
  if(data.email){
    MailApp.sendEmail({to:data.email, subject:'Thank you for registering with the Harvard Citizenship Program', htmlBody: confirmationHtml_(data), name:SENDER_NAME});
  }
}

function handleContact(ss, data){
  const sheet = ensureSheet_(ss, 'Contact Messages', CONTACT_HEADERS);
  sheet.appendRow([new Date(),'New',data.inquiryType || '',data.firstName || '',data.lastName || '',data.email || '',data.message || '',data.pageLanguage || '',data.pageUrl || '']);
  notifyDirectors_('New website inquiry: '+(data.inquiryType || 'contact'), buildContactHtml_(data));
}

function handleTutorInterest(ss, data){
  const sheet = ensureSheet_(ss, 'Tutor Interest', TUTOR_HEADERS);
  sheet.appendRow([new Date(),'New',data.firstName || '',data.lastName || '',data.email || '',data.phone || '',data.classYear || '',data.languageSkills || '',data.interests || '',data.pageLanguage || '',data.pageUrl || '']);
  notifyDirectors_('New Harvard student interest: '+fullName_(data), buildTutorHtml_(data));
  if(data.email){
    MailApp.sendEmail({to:data.email, subject:'Harvard Citizenship Program interest list', htmlBody:'<p>Thank you for your interest in the Harvard Citizenship Program. Harvard College students apply through the IOP Common Application. The Co-Directors will keep your information on the interest list and follow up when appropriate.</p><p>Harvard Citizenship Program</p>', name:SENDER_NAME});
  }
}

function cleanPartner_(partner){
  if(PARTNER_TABS.indexOf(partner) !== -1) return partner;
  return 'Independent Referrals';
}
function ensureSheet_(ss, name, headers){
  let sheet = ss.getSheetByName(name);
  if(!sheet) sheet = ss.insertSheet(name);
  if(sheet.getLastRow() === 0){
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#12233f').setFontColor('#ffffff');
  }
  return sheet;
}
function notifyDirectors_(subject, htmlBody){
  MailApp.sendEmail({to: NOTIFICATION_EMAIL, subject: subject, htmlBody: htmlBody, name:SENDER_NAME});
}
function confirmationHtml_(data){
  return '<p>Thank you for registering with the Harvard Citizenship Program.</p><p>We are honored to support your journey toward U.S. citizenship. Our Co-Directors will contact you within approximately two days to schedule your welcome meeting and discuss next steps.</p><p>Every service provided by the Harvard Citizenship Program is free.</p><p>Harvard Citizenship Program</p>';
}
function buildStudentHtml_(d, partner){
  return '<h2>New student registration</h2>'+table_({Name:fullName_(d), Email:d.email, Phone:d.phone, Partner:partner, 'Cohort / match window':d.cohort, 'Registrant type':d.registrantType, 'Preferred language':d.preferredLanguage, 'Preferred format':d.preferredFormat, Notes:d.notes, 'Page language':d.pageLanguage, URL:d.pageUrl});
}
function buildContactHtml_(d){ return '<h2>New website inquiry</h2>'+table_({'Inquiry type':d.inquiryType, Name:fullName_(d), Email:d.email, Message:d.message, 'Page language':d.pageLanguage, URL:d.pageUrl}); }
function buildTutorHtml_(d){ return '<h2>New Harvard student interest</h2>'+table_({Name:fullName_(d), Email:d.email, Phone:d.phone, 'Class year':d.classYear, 'Language skills':d.languageSkills, Interests:d.interests, 'Page language':d.pageLanguage, URL:d.pageUrl}); }
function fullName_(d){ return [d.firstName || '', d.lastName || ''].join(' ').trim(); }
function table_(obj){ let rows=''; Object.keys(obj).forEach(k=>rows += '<tr><th style="text-align:left;padding:6px;border:1px solid #ddd">'+escapeHtml_(k)+'</th><td style="padding:6px;border:1px solid #ddd">'+escapeHtml_(obj[k] || '')+'</td></tr>'); return '<table style="border-collapse:collapse">'+rows+'</table>'; }
function escapeHtml_(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function json_(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
