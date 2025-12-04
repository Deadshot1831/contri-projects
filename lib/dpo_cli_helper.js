// lib/dpo_cli_helper.js
// Masking helper used by CLI and tests

const RE_AADHAAR = /\b(\d{4}[\s\-]?\d{4}[\s\-]?\d{4})\b/g
const RE_PAN = /\b([A-Za-z]{5}\d{4}[A-Za-z])\b/gi
const RE_PHONE = /\b(?:(?:\+91|91|0)[\-\s\.]*)?([6-9]\d{9})\b/g
const RE_EMAIL = /([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g

function maskPan(m) {
  const pan = m[0]
  return pan.slice(0, 3) + 'X'.repeat(pan.length - 4) + pan.slice(-1)
}

function maskAadhaar(m) {
  const raw = m[0]
  const digits = raw.replace(/\D/g, '')
  const maskedDigits = 'X'.repeat(digits.length - 4) + digits.slice(-4)
  let di = 0
  return raw.split('').map(ch => (/\d/.test(ch) ? maskedDigits[di++] : ch)).join('')
}

function maskPhone(m) {
  const core = m[1]
  const span = m[0]
  const prefix = span.replace(core, '')
  const maskedCore = core.slice(0, 3) + 'X'.repeat(4) + core.slice(-3)
  return prefix + maskedCore
}

function maskEmail(m) {
  const local = m[1]
  const domain = m[2]
  let maskedLocal = local.length <= 2 ? '*'.repeat(local.length) : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
  return maskedLocal + '@' + domain
}

/** Build matches and optionally redact */
function collectMatches(text, opts = {}) {
  const matches = []
  let m

  RE_AADHAAR.lastIndex = 0
  while ((m = RE_AADHAAR.exec(text)) !== null) {
    const masked = opts.redact ? `[REDACTED AADHAAR]` : maskAadhaar(m)
    matches.push({ type: 'AADHAAR', start: m.index, end: RE_AADHAAR.lastIndex, m, masked })
  }

  RE_PAN.lastIndex = 0
  while ((m = RE_PAN.exec(text)) !== null) {
    const masked = opts.redact ? `[REDACTED PAN]` : maskPan(m)
    matches.push({ type: 'PAN', start: m.index, end: RE_PAN.lastIndex, m, masked })
  }

  RE_EMAIL.lastIndex = 0
  while ((m = RE_EMAIL.exec(text)) !== null) {
    const masked = opts.redact ? `[REDACTED EMAIL]` : maskEmail(m)
    matches.push({ type: 'EMAIL', start: m.index, end: RE_EMAIL.lastIndex, m, masked })
  }

  RE_PHONE.lastIndex = 0
  while ((m = RE_PHONE.exec(text)) !== null) {
    const masked = opts.redact ? `[REDACTED PHONE]` : maskPhone(m)
    matches.push({ type: 'PHONE', start: m.index, end: RE_PHONE.lastIndex, m, masked })
  }

  // Sort by start, prefer longer spans for same start
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start))
  return matches
}

/** maskText: returns { masked, entities } */
function maskText(text, opts = {}) {
  const matches = collectMatches(text, opts)
  let out = ''
  let idx = 0
  const entities = []

  for (const it of matches) {
    if (it.start < idx) continue
    out += text.slice(idx, it.start)
    out += it.masked
    entities.push({ type: it.type, match_text: it.m[0], start: it.start, end: it.end, masked: it.masked })
    idx = it.end
  }
  out += text.slice(idx)
  return { masked: out, entities }
}

module.exports = { maskText, collectMatches }
