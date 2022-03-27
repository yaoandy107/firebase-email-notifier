"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imap_1 = __importDefault(require("imap"));
const mailparser_1 = require("mailparser");
const turndown_1 = __importDefault(require("turndown"));
const ding_talk_1 = require("./ding-talk");
class MailNotifier {
    constructor(config) {
        this.imap = new imap_1.default(config);
        this.imap.once('ready', () => this.onReady());
        this.imap.once('error', this.onError);
        this.imap.once('end', this.onEnd);
    }
    startFetchingMail() {
        console.log("Start connect to IMAP server...");
        this.imap.connect();
    }
    onReady() {
        console.log("Open INBOX...");
        this.imap.openBox('INBOX', false, (err, box) => {
            if (err) {
                console.log(`openBox: ${err}`);
                return;
            }
            const searchCriteria = ['UNSEEN', ['FROM', 'firebase-noreply@google.com']];
            console.log(`Search mails with (${searchCriteria})...`);
            this.imap.search(searchCriteria, (err, uids) => {
                if (err) {
                    console.log(`search: ${err}`);
                    this.imap.end();
                    return;
                }
                if (uids) {
                    console.log(`No mail match the criteria`);
                    this.imap.end();
                    return;
                }
                var imapFetch = this.imap.fetch(uids, {
                    bodies: [''],
                    markSeen: true,
                });
                imapFetch.on('message', (msg, seqno) => {
                    var prefix = `(#${seqno}) `;
                    console.log(prefix);
                    msg.on('body', (stream, info) => {
                        this.findEmergencyMail(stream, (mail) => {
                            this.notifyDingTalk(mail);
                        });
                    });
                });
                imapFetch.once('error', (err) => {
                    console.log(`Fetch error: ${err}`);
                });
                imapFetch.once('end', () => {
                    this.imap.end();
                });
            });
        });
    }
    onError(err) {
        console.log(`onError: ${err}`);
    }
    onEnd() {
        console.log('Connection ended');
    }
    findEmergencyMail(stream, onEmergencyMailFound) {
        (0, mailparser_1.simpleParser)(stream, (err, mail) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(`[${(_a = mail.date) === null || _a === void 0 ? void 0 : _a.toLocaleDateString()}] ${mail.subject}`);
            if (((_b = mail.subject) === null || _b === void 0 ? void 0 : _b.includes("穩定性問題")) && mail.html) {
                onEmergencyMailFound(mail);
            }
        }));
    }
    notifyDingTalk(mail) {
        var turndownService = new turndown_1.default();
        var markdown = turndownService.turndown(mail.html || '');
        const message = {
            "msgtype": "markdown",
            "markdown": {
                "title": mail.subject || "",
                "text": markdown
            },
            "at": {
                "isAtAll": false
            }
        };
        (0, ding_talk_1.sendActionCardMessage)(message);
    }
}
exports.default = MailNotifier;
