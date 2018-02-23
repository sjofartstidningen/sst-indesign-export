import './polyfills';
import { join } from 'path'; // eslint-disable-line import/first
import {
  createInputWindow,
  createDropdownWindow,
  createProgressbarWindow,
  createFolderChooser,
} from './utils/windows';
import {
  range,
  parseRange,
  map,
  filter,
  every,
  findIndex,
  pipe,
  clamp,
  padStart,
  tap,
} from './utils';
import ConfigStore from './utils/configstore';
import pkg from '../package.json';

const config = new ConfigStore({
  ...pkg,
  defaultConfig: {
    preset: null,
    exportRoot: null,
  },
});

/**
 * Returns data about the current document which will be used by the program
 *
 * @params {Document} doc A document to get total pages from
 * @returns {Object}
 */
function getDocumentData(doc) {
  const re = /\/(\d{4})\/(\d{2})$/;
  const [, year, issue] = re.exec(doc.filePath);

  const validYear = year && !Number.isNaN(Number.parseInt(year, 10));
  const validIssue = issue && !Number.isNaN(Number.parseInt(issue, 10));

  if (!validYear || !validIssue) {
    throw new Error(
      `Filen kan inte exporteras då den antagligen ligger på fel plats
Filen måste ligga i en mappstruktur liknande "/mapp/2018/01/${doc.name}"`,
    );
  }

  let exportRoot = config.get('exportRoot');

  if (!exportRoot) {
    alert(`Detta är första gången du använder programmet
Du måste därför välja var Bryggan-mappen finns på din dator`);

    const result = createFolderChooser({ label: 'Välj Bryggan-mappen' });
    if (result.cancel) throw new Error('Avslutades av användaren');

    config.set('exportRoot', result.value.absoluteURI);
    exportRoot = result.value.absoluteURI;
  }

  return {
    year,
    issue,
    name: doc.name,
    first: Number.parseInt(doc.pages.firstItem().name, 10),
    last: Number.parseInt(doc.pages.lastItem().name, 10),
    totalPages: doc.pages.length,
    exportFolder: join(exportRoot, year, issue),
    exportRoot,
  };
}

/**
 * getPagesRange will ask the user for which pages to process. The return value
 * is an array of numbers representing an index.
 *
 * totalPages can be provided to cap the range array.
 *
 * Example input:
 * 1,3-5 -> [1,3,4,5]
 * 1-5   -> [1,2,3,4,5]
 * 4,2,6 -> [2,4,6]
 *
 * @param {number} firstPage Page number for first page
 * @param {number} lastPage Page number for last page
 * @returns Array<number>
 */
function getPagesRange(firstPage, lastPage) {
  const allPages = 'Alla sidor'; // Keyword for selecting all pages
  const input = createInputWindow({
    name: 'Välj sidor:',
    initial: allPages,
  });

  input.validateInput(text => {
    /**
     * Validate that the input is valid while typing.
     * An input equal to the variable "allPages" is always valid.
     * Otherwise allowed characters (comma, dash, whitespace) is stripped and
     * every character is checked to see if it's a number.
     */
    if (text === allPages) return true;

    const allowedChars = /(,|-|\s+)/g;
    const stripped = text.replace(allowedChars, '').split('');
    return every(pipe(Number.parseInt, n => !Number.isNaN(n)), stripped);
  });

  const result = input.show();

  /**
   * If the user cancels the operation throws an error.
   * This error will be swallowed higher up in the hierachy.
   */
  if (result.cancel) throw new Error('Avslutades av användaren');

  /**
   * Return a array range of all pages if result.value === allPages.
   * Otherwise parse the input to an array of page numbers, but remove
   * everything not in between first and last page.
   */
  if (result.value === allPages) return range(firstPage, lastPage);

  const inRange = n => n >= firstPage && n <= lastPage;
  return filter(inRange, parseRange(result.value));
}

/**
 * Get a PDFExportPreset object
 * It will display a dropdown list with all available export presets and prompt
 * the user to select one.
 *
 * The default preset will be fetched from the preference file and also updated
 * if the user chooses a new preference
 *
 * @returns {PDFExportPreset}
 */
function getPdfPreset() {
  const { pdfExportPresets } = app;
  const cachedPreset = config.get('preset');

  const presets = map(p => p.name, pdfExportPresets);
  const initial = clamp(
    0,
    Infinity,
    findIndex(x => x === cachedPreset, presets),
  );

  const dropdown = createDropdownWindow({
    name: 'Välj PDF-inställning',
    label: 'Inställningar:',
    items: presets,
    initial,
  });

  const result = dropdown.show();

  if (result.cancel) throw new Error('Avslutades av användaren');

  const choosenPreset = pdfExportPresets.itemByName(result.value);

  if (choosenPreset.name !== cachedPreset) {
    config.set('preset', choosenPreset.name);
  }

  return choosenPreset;
}

/**
 * Exports every page in the opts.pages array to the given folder
 *
 * @params {Document}       doc               Selected document
 * @param {Array<number>}   opts.pages        An array of numbers indicating pages
 * @param {PDFExportPreset} opts.preset       PDF preset
 * @param {String}          opts.folder       Folder to export into
 * @param {Function}        opts.generateName Function to generate a new name (will recieve current index as only arg)
 * @returns {Array<BackgroundTask>}
 */
function exportPages(doc, { pages, preset, folder, generateName }) {
  const progressWindow = createProgressbarWindow({
    name: 'Exporterar',
    label: 'Exporterar sidor',
    max: pages.length,
  });

  progressWindow.show();

  let actualFolder = new Folder(folder);
  if (!actualFolder.exists) actualFolder = actualFolder.create();
  const folderPath = actualFolder.absoluteURI;

  const exportPdf = pipe(
    tap(p => {
      doc.parent.pdfExportPreferences.pageRange = `${p}`; // eslint-disable-line no-param-reassign
    }),
    generateName,
    fileName =>
      doc.asynchronousExportFile(
        ExportFormat.PDF_TYPE,
        new File(join(folderPath, fileName)),
        false,
        preset,
      ),
    tap(progressWindow.increase),
  );

  const tasks = map(exportPdf, pages);

  progressWindow.close();
  return tasks;
}

function main() {
  try {
    const currentDocument = app.activeDocument;
    const documentData = getDocumentData(currentDocument);

    const pages = getPagesRange(documentData.first, documentData.last);
    const preset = getPdfPreset();

    exportPages(currentDocument, {
      pages,
      preset,
      folder: documentData.exportFolder,
      generateName: page =>
        `${documentData.year}-${documentData.issue}-${padStart(
          3,
          '0',
          page,
        )}.pdf`,
    });
  } catch (err) {
    alert(err.message);
  }
}

main();
