const { createTransport } = require('nodemailer')
const { compileFile } = require('pug')
const { getEnv } = require('./util')

const MAIL_HOST = getEnv('MAIL_HOST', 'string', null)
const MAIL_FROM = getEnv('MAIL_FROM', 'string', null)
const MAIL_PASS = getEnv('MAIL_PASS', 'string', null)
const MAIL_RATE = getEnv('MAIL_RATE', 'int', null)
const MAIL_SECURE = getEnv('MAIL_SECURE', 'bool', true)

let transporter
if (MAIL_HOST) {
  const from = MAIL_FROM
  const options = {
    host: MAIL_HOST,
    auth: { user: from, pass: MAIL_PASS },
    secure: MAIL_SECURE
  }
  if (MAIL_RATE) {
    options.pool = true
    options.rateLimit = MAIL_RATE
  }
  transporter = createTransport(options, { from })
}

const templates = {}
function addTemplate(name, file) {
  templates[name] = compileFile(file)
}

async function send(options) {
  if (!transporter) throw new Error('MAIL_URL not configured')

  // parse templtae
  if (options.template) {
    const template = templates[options.template]
    if (!template) throw new Error(`Template ${options.template} not found`)
    options.html = template(options.variables)
  }

  console.log(`SEND MAIL TO:${options.to} SUBJECT:${options.subject} TEXT:${options.text}`)

  return transporter.sendMail(options)
}

module.exports = {
  addTemplate,
  send
}
