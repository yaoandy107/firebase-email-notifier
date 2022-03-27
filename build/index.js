"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const mail_notifier_1 = __importDefault(require("./services/mail-notifier"));
const mailEmergencyNotifier = new mail_notifier_1.default(config_1.default.imap);
const FETCH_INTERVAL = 1000 * 60 * 10;
checkEmailInterval();
function checkEmailInterval() {
    try {
        mailEmergencyNotifier.startFetchingMail();
    }
    catch (err) {
        console.log(`checkEmail: ${err}`);
    }
    setTimeout(checkEmailInterval, FETCH_INTERVAL);
}
