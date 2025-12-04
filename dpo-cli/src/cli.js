const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .command('ocr <file>', 'Perform OCR on the specified file', (yargs) => {
    yargs.positional('file', {
      describe: 'The file to perform OCR on',
      type: 'string',
    });
  })
  .command('version', 'Show the version of the CLI', () => {}, () => {
    console.log('dpo-cli version 0.2.0');
  })
  .help()
  .argv;

if (argv._.includes('ocr')) {
  const { performOCR } = require('./ocr/tesseract');
  performOCR(argv.file);
}