import { createTransport, Transporter } from 'nodemailer'
import { compileFile, compileTemplate } from 'pug'
import { Service } from 'typedi'
import { Config } from './Config'
import { MailMissingTemplateError } from './errors'

export interface MailAttachment {
  filename?: string
  content?: string | Buffer
  path?: string
}

export interface MailMessage {
  to: string | string[]
  subject: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string
  text?: string | Buffer
  html?: string | Buffer
  attachments?: MailAttachment[]
  template?: string
  variables?: Record<string, any>
}

@Service()
export class Mail {
  protected templates: Record<string, compileTemplate> = {}
  protected _transport?: Transporter

  constructor(protected config: Config) {
    this.config.define('MAIL')
  }

  addTemplate(name: string, file: string): void {
    this.templates[name] = compileFile(file)
  }

  async send(message: MailMessage): Promise<void> {
    if (message.template) {
      const template = this.templates[message.template]
      if (!template) throw new MailMissingTemplateError(message.template)
      message.html = template(message.variables)
      delete message.template
      delete message.variables
    }
    await this.transport.sendMail(message)
  }

  protected get transport(): Transporter {
    if (!this._transport) {
      const mail = this.config.get('MAIL')
      if (!mail) throw new Error(`Missing mail configuration`)
      this._transport = createTransport(mail)
    }
    return this._transport
  }

}
