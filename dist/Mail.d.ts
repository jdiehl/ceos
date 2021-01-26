/// <reference types="node" />
import { Transporter } from 'nodemailer';
import { compileTemplate } from 'pug';
import { Config } from './Config';
export interface MailAttachment {
    filename?: string;
    content?: string | Buffer;
    path?: string;
}
export interface MailMessage {
    to: string | string[];
    subject: string;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    text?: string | Buffer;
    html?: string | Buffer;
    attachments?: MailAttachment[];
    template?: string;
    variables?: Record<string, any>;
}
export declare class Mail {
    protected config: Config;
    protected templates: Record<string, compileTemplate>;
    protected _transport?: Transporter;
    constructor(config: Config);
    addTemplate(name: string, file: string): void;
    send(message: MailMessage): Promise<void>;
    protected get transport(): Transporter;
}
//# sourceMappingURL=Mail.d.ts.map