const sgMail = require('@sendgrid/mail')
const { compileFile } = require('pug')
const { getEnv } = require('./util')

const SENDGRID_API_KEY = getEnv('SENDGRID_API_KEY', 'string', null)
const SENDGRID_FROM = getEnv('SENDGRID_FROM', 'string', null)

if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY)

const templates = {}
function addTemplate(name, file) {
  templates[name] = compileFile(file)
}

async function send(msg) {
  if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not configured')

  msg.from = msg.from || SENDGRID_FROM

  // parse template
  if (msg.template) {
    const template = templates[msg.template]
    if (!template) throw new Error(`Template ${msg.template} not found`)
    msg.html = template(msg.variables)
  }

  console.log(`SEND MAIL TO:${msg.to} SUBJECT:${msg.subject} TEXT:${msg.text}`)
  return sgMail.send(msg)
}

module.exports = {
  addTemplate,
  send
}
