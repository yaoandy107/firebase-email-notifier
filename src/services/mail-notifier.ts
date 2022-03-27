import Connection from 'imap'
import Imap from 'imap'
import { ParsedMail, simpleParser } from 'mailparser'
import TurndownService from 'turndown'
import { MarkdownMessage } from '../models/message'
import { sendActionCardMessage } from './ding-talk'

export default class MailNotifier {
    imap: Imap

    constructor(config: Connection.Config) {
        this.imap = new Imap(
            config
        )
        this.imap.once('ready', () => this.onReady())
        this.imap.once('error', this.onError)
        this.imap.once('end', this.onEnd)
    }

    startFetchingMail() {
        console.log("Start connect to IMAP server...")
        this.imap.connect()
    }

    onReady() {
        console.log("Open INBOX...")
        this.imap.openBox('INBOX', false, (err: Error, box: Connection.Box) => {
            if (err) {
                console.log(`openBox: ${err}`)
                return
            }
            const searchCriteria = ['UNSEEN', ['FROM', 'firebase-noreply@google.com']]
            console.log(`Search mails with (${searchCriteria})...`)
            this.imap.search(
                searchCriteria,
                (err: Error, uids: number[]) => {
                    if (err) {
                        console.log(`search: ${err}`)
                        this.imap.end()
                        return
                    }
                    if (uids) {
                        console.log(`No mail match the criteria`)
                        this.imap.end()
                        return
                    }

                    var imapFetch = this.imap.fetch(
                        uids,
                        {
                            bodies: [''],
                            markSeen: true,
                        })

                    imapFetch.on('message', (msg, seqno) => {
                        var prefix = `(#${seqno}) `
                        console.log(prefix)
                        msg.on('body', (stream, info) => {
                            this.findEmergencyMail(stream, (mail) => {
                                this.notifyDingTalk(mail)
                            })
                        })
                    })

                    imapFetch.once('error', (err) => {
                        console.log(`Fetch error: ${err}`)
                    })

                    imapFetch.once('end', () => {
                        this.imap.end()
                    })
                }
            )
        })
    }

    onError(err: Error) {
        console.log(`onError: ${err}`)
    }

    onEnd() {
        console.log('Connection ended')
    }

    findEmergencyMail(stream: NodeJS.ReadableStream, onEmergencyMailFound: (mail: ParsedMail) => void) {
        simpleParser(stream, async (err, mail) => {
            console.log(`[${mail.date?.toLocaleDateString()}] ${mail.subject}`)
            if (mail.subject?.includes("穩定性問題") && mail.html) {
                onEmergencyMailFound(mail)
            }
        })
    }

    notifyDingTalk(mail: ParsedMail) {
        var turndownService = new TurndownService()
        var markdown = turndownService.turndown(mail.html || '')
        const message: MarkdownMessage = {
            "msgtype": "markdown",
            "markdown": {
                "title": mail.subject || "",
                "text": markdown
            },
            "at": {
                "isAtAll": false
            }
        }
        sendActionCardMessage(message)
    }
}