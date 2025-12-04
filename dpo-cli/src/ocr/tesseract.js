const Tesseract = require('tesseract.js');

function recognizeText(imagePath) {
    return Tesseract.recognize(
        imagePath,
        'eng',
        {
            logger: info => console.log(info) // Optional logger
        }
    ).then(({ data: { text } }) => {
        return text;
    });
}

module.exports = {
    recognizeText
};