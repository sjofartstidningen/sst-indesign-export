/* eslint-disable camelcase */

const en_US = {
  'This is the first time you are using this script\nYou therefore have to choose the root folder to export to':
    'This is the first time you are using this script\nYou therefore have to choose the root folder to export to',
  'Choose root folder': 'Choose root folder',
  'All pages': 'All pages',
  'Choose pages:': 'Choose pages',
  'Choose PDF-preset': 'Choose PDF-preset',
  'Presets:': 'Presets:',
  Exporting: 'Exporting',
  'Exporting pages': 'Exporting pages',
  Ok: 'Ok',
  Cancel: 'Cancel',
  'View help': 'View help',
  of: 'of',
  'An error occured': 'An error occured',
  'Script cancelled by user': 'Script cancelled by user',
  'No documents open': 'No documents open',
  "Path to this file doesn't match the expected structure":
    "Path to this file doesn't match the expected structure",
  'From must be greater than or equal to to':
    'From must be greater than or equal to to',
  'Update available': 'Update available',
  'A new version of this script is available, would you like to download it?':
    'A new version of this script is available, would you like to download it?',
  'Download update': 'Download update',
  'New script downloaded\nRemember to remove the old version and update any keyboard shortcuts created':
    'New script downloaded\nRemember to remove the old version and update any keyboard shortcuts created',
};

const sv_SE = {
  'This is the first time you are using this script\nYou therefore have to choose the root folder to export to':
    'Detta är första gången du använder skriptet\nDu måste därför välja den mapp som allt ska exporteras till',
  'Choose root folder': 'Välj mapp',
  'All pages': 'Alla sidor',
  'Choose pages:': 'Välj sidor',
  'Choose PDF-preset': 'Välj PDF-förinställning',
  'Presets:': 'Förinställningar:',
  Exporting: 'Exporterar',
  'Exporting pages': 'Exporterar sidor',
  Ok: 'Ok',
  Cancel: 'Avsluta',
  'View help': 'Visa hjälp',
  of: 'av',
  'An error occured': 'Ett fel uppstod',
  'Script cancelled by user': 'Skriptet avslutades av användare',
  'No documents open': 'Inga dokument öppna',
  "Path to this file doesn't match the expected structure":
    'Sökvägen till filen matchade inte den förväntade mappstrukturen',
  'From must be greater than or equal to to':
    'Från måste vara större än, eller lika stort som, till',
  'Update available': 'Ny uppdatering tillgänglig',
  'A new version of this script is available, would you like to download it?':
    'En ny version av det här scriptet finns tillgängligt, vill du ladda ner det?',
  'Download update': 'Ladda ner uppdatering',
  'New script downloaded\nRemember to remove the old version and update any keyboard shortcuts created':
    'Ny version nedladdat\nKom ihåg att ta bort det gamla skriptet och uppdatera de kortkommandon som du ställt in',
};

const langs = {
  en_US,
  sv_SE,
};

function i18n(key) {
  const { locale } = $ || { locale: 'en_US' };
  const lang = langs[locale];
  const str = lang[key];

  if (!str) {
    if (process.env.NODE_ENV !== 'production')
      $.writeln(`String not translated (${locale}): ${key}`);

    const enStr = en_US[key];
    return enStr || key;
  }

  return str;
}

export { i18n as default, langs };
