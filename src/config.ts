import 'dotenv/config'

export default {
    imap: {
        user: process.env.EMAIL_ACCOUNT || '',
        password: process.env.EMAIL_PASSWORD || '',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
            servername: 'imap.gmail.com'
        },
    },
    dingTalk: {
        accessToken: process.env.DING_TALK_ACCESS_TOKEN || ''
    }
}
