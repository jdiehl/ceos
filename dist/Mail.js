"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const nodemailer_1 = require("nodemailer");
const pug_1 = require("pug");
const typedi_1 = require("typedi");
const Config_1 = require("./Config");
const errors_1 = require("./errors");
let Mail = class Mail {
    constructor(config) {
        this.config = config;
        this.templates = {};
        this.config.define('MAIL');
    }
    async init() {
        const mail = this.config.get('MAIL');
        if (mail) {
            this.transport = nodemailer_1.createTransport(mail);
        }
    }
    addTemplate(name, file) {
        this.templates[name] = pug_1.compileFile(file);
    }
    async send(message) {
        if (message.template) {
            const template = this.templates[message.template];
            if (!template)
                throw new errors_1.MailMissingTemplateError(message.template);
            message.html = template(message.variables);
            delete message.template;
            delete message.variables;
        }
        await this.transport.sendMail(message);
    }
};
Mail = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Config_1.Config])
], Mail);
exports.Mail = Mail;
