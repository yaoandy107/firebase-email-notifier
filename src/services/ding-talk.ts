import axios from 'axios'
import config from '../config'
import { DingTalkResponse } from '../models/response'
import { MarkdownMessage } from '../models/message';

export async function sendActionCardMessage(message: MarkdownMessage) {
    console.log(message)
    const accessToken = config.dingTalk.accessToken
    const url = `https://api.dingtalk.com/robot/send?access_token=${accessToken}`
    const response = await (await axios.post<DingTalkResponse>(url, message)).data
    if (response.errcode !== 0) {
        console.log(`DingTalk Error(${response.errcode}): ${response.errmsg}`)
    }
}