const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const { compileFile } = require('pug')
const { getEnv } = require('./util')

const SENDGRID_API_KEY = getEnv('SENDGRID_API_KEY', 'string', null)
const SENDGRID_FROM = getEnv('SENDGRID_FROM', 'string', null)

const MAIL_HOST = getEnv('MAIL_HOST', 'string', null)
const MAIL_FROM = getEnv('MAIL_FROM', 'string', null)
const MAIL_PASS = getEnv('MAIL_PASS', 'string', null)
const MAIL_RATE = getEnv('MAIL_RATE', 'int', 10)
const MAIL_DELTA = getEnv('MAIL_DELTA', 'int', 1000)

// set up send grid
// todo: switch to https://sendgrid.com/blog/sending-email-nodemailer-sendgrid/
if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY)

// set up nodemailer
let transport
if (MAIL_HOST) {
  console.log('config', {
    host: MAIL_HOST,
    auth: {
      user: MAIL_FROM,
      pass: MAIL_PASS
    },
    pool: true,
    rateLimit: MAIL_RATE,
    rateDelta: MAIL_DELTA
  })
  transport = nodemailer.createTransport({
    host: MAIL_HOST,
    auth: {
      user: MAIL_FROM,
      pass: MAIL_PASS
    },
    pool: true,
    rateLimit: MAIL_RATE,
    rateDelta: MAIL_DELTA
  })
}

const templates = {}
function addTemplate(name, file) {
  templates[name] = compileFile(file)
}

async function send(msg) {
  if (!SENDGRID_API_KEY && !MAIL_HOST) throw new Error('Email not configured')

  msg.from = msg.from || MAIL_FROM || SENDGRID_FROM

  // parse template
  if (msg.template) {
    const template = templates[msg.template]
    if (!template) throw new Error(`Template ${msg.template} not found`)
    msg.html = template(msg.variables)
  }

  console.log(`SEND MAIL TO:${msg.to} SUBJECT:${msg.subject} TEXT:${msg.text}`)
  return transport ? transport.sendMail(msg) : sgMail.send(msg)
}

module.exports = {
  addTemplate,
  send
}
