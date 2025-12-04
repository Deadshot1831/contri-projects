bin/dpo_cli.js
const fs = require('fs')
const path = require('path')
const { maskText } = require('../lib/dpo_cli_helper')
const { createWorker } = require('tesseract.js')

function parseArgs(argv) {
  const out = { jsonOutput: false, images: [] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--text') { out.text = argv[++i] }
    else if (a === '--input-file') { out.inputFile = argv[++i] }
    else if (a === '--output-file') { out.outputFile = argv[++i] }
    else if (a === '--json-output') { out.jsonOutput = true }
    else if (a === '--image') {
      const v = argv[++i]
      out.images = out.images.concat(v.split(',').map(s => s.trim()).filter(Boolean))
    }
    else if (a === '--redact') { out.redact = true }
    else {
      console.error('Unknown arg:', a)
      process.exit(1)
    }
  }
  return out
}

async function ocrImages(imagePaths) {
  if (!imagePaths || imagePaths.length === 0) return ''

  let worker
  try {
    worker = await createWorker('eng')
  } catch (err) {
    // fallback
  }

  if (!worker) {
    worker = createWorker({ logger: () => {} })
    if (typeof worker.load === 'function') {
      await worker.load()
      if (typeof worker.loadLanguage === 'function') await worker.loadLanguage('eng')
      if (typeof worker.initialize === 'function') await worker.initialize('eng')
    } else if (typeof worker.initialize === 'function') {
      await worker.initialize('eng')
    }
  }

  let combined = ''
  for (const p of imagePaths) {
    const full = path.resolve(p)
    if (!fs.existsSync(full)) {
      console.error(`Image not found: ${p}`)
      continue
    }
    try {
      const result = await worker.recognize(full)
      const text = result && result.data && result.data.text ? result.data.text : (result && result.text ? result.text : '')
      combined += (text || '') + '\n'
    } catch (err) {
      console.error(`OCR failed for ${p}:`, err.message || err)
    }
  }

  if (worker && typeof worker.terminate === 'function') await worker.terminate()
  return combined
}

async function main() {
  const args = parseArgs(process.argv)

  let text = ''
  if (args.text) text = args.text
  else if (args.inputFile) text = fs.readFileSync(args.inputFile, 'utf8')

  if (args.images && args.images.length > 0) {
    const ocrText = await ocrImages(args.images)
    text = (text ? (text + '\n' + ocrText) : ocrText)
  }

  if (!text) {
    console.error('Provide --text, --input-file, or --image <path[,path...]>')
    process.exit(1)
  }

  const res = maskText(text, { redact: !!args.redact })

  if (args.outputFile) fs.writeFileSync(args.outputFile, res.masked, 'utf8')
  else console.log(res.masked)

  if (args.jsonOutput) {
    console.log('\n=== DETECTED ENTITIES (JSON) ===\n' + JSON.stringify(res.entities, null, 2))
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
}
