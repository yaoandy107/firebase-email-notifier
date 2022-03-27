import config from "./config"
import MailEmergencyNotifier from "./services/mail-notifier"

const mailEmergencyNotifier = new MailEmergencyNotifier(config.imap)
const FETCH_INTERVAL = 1000 * 60 * 10

checkEmailInterval()

function checkEmailInterval() {
    try {
        mailEmergencyNotifier.startFetchingMail()
    } catch (err) {
        console.log(`checkEmail: ${err}`)
    }
    setTimeout(checkEmailInterval, FETCH_INTERVAL)
}
