# dpo-cli Project

## Overview
dpo-cli is a command-line interface (CLI) application designed to leverage the power of Tesseract.js for optical character recognition (OCR). This project provides a simple way to interact with OCR functionalities directly from the command line.

## Features
- Command-line interface for OCR tasks
- Utilizes Tesseract.js for accurate text recognition
- Easy to use with various command options

## Installation
To install the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/dpo-cli.git
cd dpo-cli
npm install
```

## Usage
To use the CLI, run the following command:

```bash
node bin/dpo_cli.js [options]
```

### Options
- `--input <file>`: Specify the input image file for OCR.
- `--output <file>`: Specify the output file to save the recognized text.
- `--lang <language>`: Specify the language for OCR (default is English).

## Running Tests
To run the tests for the project, use the following command:

```bash
npm test
```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.