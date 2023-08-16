import * as fs from 'fs';
import axios from 'axios';

async function main() {
    // 邀请链接
    const referral_link = "https://www.branche.ai/waitlist?ref_id=XX";
    try {
        const fileContents = fs.readFileSync('./mails.txt', 'utf8');
        const mails = fileContents.split('\r\n');

        for (let i = 0; i < mails.length; i++) {
            const axiosIns = axios.create({
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67'
                },
                timeout: 60000,
            })
            let uuid: string;

            let postData = {
                "location": referral_link,
                "waitlist_id": "8317",
                "referrer": "",
                "widget_type": "WIDGET_1"
            }
            await axiosIns.post("https://api.getwaitlist.com/api/v1/widget_heartbeats", postData, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Microsoft Edge\";v=\"115\", \"Chromium\";v=\"115\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "sec-gpc": "1",
                    "Referer": "https://www.branche.ai/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
            }).then((res) => {
                console.log(i + ":" + JSON.stringify(res.data));
                if (res.data.uuid) {
                    uuid = res.data.uuid;
                }
            }).catch((error) => {
                console.log(i + ":" + `nonce error:${error}`);
            });
            if (!uuid) {
                continue;
            }
            const mailItem = mails[i];
            let data = {
                "waitlist_id": 8317,
                "referral_link": referral_link,
                "heartbeat_uuid": uuid,
                "widget_type": "WIDGET_1",
                "email": mailItem,
                "answers": []
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await axiosIns.post("https://api.getwaitlist.com/api/v1/waiter", data, {
                "headers": {
                    "accept": "application/json",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Microsoft Edge\";v=\"115\", \"Chromium\";v=\"115\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "sec-gpc": "1",
                    "Referer": "https://www.branche.ai/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
            }).then((res) => {
                console.log(i + ":" + JSON.stringify(res.data));
            }).catch((error) => {
                console.log(i + ":" + `verify error:${error}`);
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.log('all error' + error);
    } finally {
        console.log('all complete');
    }
}
main()