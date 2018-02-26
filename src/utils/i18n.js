/* eslint-disable camelcase */

const en_US = {
  'This is the first time you are using this script\nYou therefore have to choose the root folder to export to':
    'This is the first time you are using this script\nYou therefore have to choose the root folder to export to',
  'Choose root folder': 'Choose root folder',
  'All pages': 'All pages',
  'Choose pages': 'Choose pages',
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
};

const sv_SE = {
  'This is the first time you are using this script\nYou therefore have to choose the root folder to export to':
    'Detta är första gången du använder skriptet\nDu måste därför välja den mapp som allt ska exporteras till',
  'Choose root folder': 'Välj mapp',
  'All pages': 'Alla sidor',
  'Choose pages': 'Välj sidor',
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
    'Från måste vara större än, eller lika stort som till',
};

const langs = {
  en_US,
  sv_SE,
};

function i18n(lang = 'en_US') {
  const langObj = langs[lang] || lang.en_US;

  return key => {
    const str = langObj[key];

    if (!str) {
      const enStr = en_US[key];
      return enStr || str;
    }

    return str;
  };
}

export { i18n as default, langs };
