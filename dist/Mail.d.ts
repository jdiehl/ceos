/// <reference types="node" />
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
    private config;
    private templates;
    private transport;
    constructor(config: Config);
    init(): Promise<void>;
    addTemplate(name: string, file: string): void;
    send(message: MailMessage): Promise<void>;
}
//# sourceMappingURL=Mail.d.ts.map