import { segment } from "oicq";
import fetch from "node-fetch";
import { Config} from '../components/index.js'
const _path = process.cwd();
let timeout = 10000; 
let CD = {};
let isR18 = true;
let isR18s = true;

export class r18ss extends plugin {
    constructor() {
        super(
            {
                name: '涩涩',
                dsc: '涩涩',
                event: 'message',
                priority: 1000,
                rule: [
                    {
                        reg: '^(涩涩|色色|sese|瑟瑟)$',
                        fnc: 'ss'
                    },
                ]
            })
        }
        async ss(e) {
        if(!Config.getConfig('set','pz')['ss']&&!e.isMaster) {return false}
        if (e.isGroup) {
            if (CD[e.user_id] && !e.isMaster) {
                e.reply("等10秒先");
                return true;
            }
            CD[e.user_id] = true;
            CD[e.user_id] = setTimeout(() => {
                if (CD[e.user_id]) {
                    delete CD[e.user_id];
                }
            }, 10000);
            let url;
            let msg;
            if (!isR18) {
                url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0`;
                const response = await fetch(url); //调用接口获取数据
                let res = await response.json(); //结果json字符串转对象
                msg = [
                    segment.image(res.data[0].urls.original),
                ];
            } else {
                e.reply(`正在搜图...`);
                url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0`;
                const response = await fetch(url); //调用接口获取数据
                let res = await response.json(); //结果json字符串转对象
                msg = [
                    segment.image(res.data[0].urls.original),
                ];
            }
            //发送消息
            let msgRes = await e.reply(msg);
            if (timeout != 0 && msgRes && msgRes.message_id) {
                let target = e.group;
                setTimeout(() => {
                    target.recallMsg(msgRes.message_id);
                }, timeout);
            }
            return true; //返回true 阻挡消息不再往下
        } else {  //私聊
            if (CD[e.user_id] && !e.isMaster) {
                e.reply("涩批等30秒");//更改完冷却时间记得更改这里的时间.
                return true;
            }
            CD[e.user_id] = true;
            CD[e.user_id] = setTimeout(() => {
                if (CD[e.user_id]) {
                    delete CD[e.user_id];
                }
            }, 30000);
            e.reply(`正在搜图...`);
            let url = '';
            if (!isR18s) {
                url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0`;
            } else {
                url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=1`;
            }
            const response = await fetch(url);
            let res = await response.json();
            let TagNumber = res.data[0].tags.length;
            let Atags;
            let Btags;
            let qwq = 0;
            while (TagNumber--) {
                Atags = res.data[0].tags[TagNumber];
                if (qwq == 0) {
                    Btags = "";
                }
                Btags = Btags + " " + Atags;
                qwq++;
            }
            let msg;
            let pid = res.data[0].pid;
            msg = [
                "标题：",
                res.data[0].title,
                "\n作者：",
                res.data[0].author,
                "\n关键词：",
                Btags,
                segment.image(res.data[0].urls.original),
            ];
            e.reply(msg)
            return true;
        }
    }
}