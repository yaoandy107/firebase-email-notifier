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
exports.sendActionCardMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
function sendActionCardMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(message);
        const accessToken = config_1.default.dingTalk.accessToken;
        const url = `https://api.dingtalk.com/robot/send?access_token=${accessToken}`;
        const response = yield (yield axios_1.default.post(url, message)).data;
        if (response.errcode !== 0) {
            console.log(`DingTalk Error(${response.errcode}): ${response.errmsg}`);
        }
    });
}
exports.sendActionCardMessage = sendActionCardMessage;
