import { segment } from "oicq";
import fetch from "node-fetch";
import { Config} from '../components/index.js'
import fs from 'fs'
import YAML from 'yaml'
const _path = process.cwd();
let timeout = 10000; 
let CD = {};
let isR18 = true;
let isR18s = true;
let botsender = true;
if(Config.getConfig('set','mz')['botname']==null){
    logger.info('【枫叶插件】检测到未设置机器人名字')
    logger.info(' 请发送：枫叶设置，查看名字')
  }
  let bot = Config.getConfig('set','mz')['botname']
  let path='./plugins/hs-qiqi-plugin/config/冷却.yaml'
  let ss = 0;

  if (!fs.existsSync(path)) {fs.writeFileSync(path,'')}
export class r18ss extends plugin {
    constructor() {
        super(
            {
                name: '[枫叶]涩涩',
                dsc: '涩涩',
                event: 'message',
                priority: 1,
                rule: [
                    {
                        reg: '^枫叶涩涩帮助$',
                        fnc: 'fy'
                    },
                    {
                        reg: '^给我(涩|色)图.*$',
                        fnc: 's'
                    },
                    {
                        reg: '^涩图更换(动漫源|现实源|p站源)$',
                        fnc: 'o'
                    },
                    {
                        reg: '^涩图撤回时间.*$',
                        fnc: 't'
                    },
                    {
                        reg: '^(涩涩|色色|sese|瑟瑟)$',
                        fnc: 'ss'
                    },
                ]
            })
        }
        async fy(e){
            if(!Config.getConfig('set','pz')['ss']&&!e.isMaster) {return false}
            if(!e.isMaster){e.reply('你不是主人走开');return true}
            let ee = await getread();
            let u = ee / 1000;
            let nickname = Bot.nickname
            if (this.e.isGroup) {
            let info = await Bot.getGroupMemberInfo(this.e.group_id, Bot.uin)
          nickname = info.card ?? info.nickname
          }
           let userInfo = {
           user_id: Bot.uin,
           nickname
            }
            let forwardMsg = [
                {
                  ...userInfo,
                  message: '=====枫叶涩图帮助====='
                }
              ]
            let msg = [];
            let ui =[];
            msg.push(`当前枫叶涩图撤回时间为${u}秒\n可发送涩图撤回时间()秒来调整`)
            if(ss==0){
                ui.push(`当前枫叶涩图源为现实源\n可发送涩图更换(动漫源|现实源|p站源)`)}
                else if(ss==1){
                    ui.push(`当前枫叶涩图源为动漫源\n可发送涩图更换(动漫源|现实源|p站源)`)}else{
                        ui.push(`当前枫叶涩图源为p站源\n可发送涩图更换(动漫源|现实源|p站源)`)
                    }
          forwardMsg.push(
            {
              ...userInfo,
              message: msg
            }
          )
          forwardMsg.push(
            {
              ...userInfo,
              message: ui
            }
          )
          forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
            await e.reply(forwardMsg)
        }
        async o(e){
            if(!Config.getConfig('set','pz')['ss']&&!e.isMaster) {return false}
            if(!e.isMaster){e.reply('你不是主人走开');return true}
            if (e.msg.includes('涩图更换p站源')){
                ss = 2;
                await e.reply('更换成功涩图源为p站源')
                return true;}
            if (e.msg.includes('涩图更换动漫源')){
                ss = 1;
                await e.reply('更换成功涩图源为动漫源')
                return true;
        }
        if (e.msg.includes('涩图更换现实源')){
            ss = 0;
            await e.reply('更换成功涩图源为现实源')
            return true;
    }return;}
        async t(e){
            if(!Config.getConfig('set','pz')['ss']&&!e.isMaster) {return false}
            if(!e.isMaster){e.reply('你不是主人走开');return true}
                let data=await getread()
                if (!data) data= [];
                let st = e.message[0].text.replace(/涩图撤回时间/g, "").trim();
                let i = st * 1000;
                if(i != ''){
                    await data.splice(data.indexOf(i), 1)
                }
                await data.push(i);
                await e.reply(`当前涩图撤回时间为${st}秒`)
                getwrite(data)
                return true
        }
        async s(e){
            if(!Config.getConfig('set','pz')['ss']&&!e.isMaster) {return false}
            let rr = await getread()
            if(rr == ''){
                await e.reply('请先设置涩涩冷却再使用')
                return true;
            }
            if(!e.group){
                await e.reply('请在群聊使用')
                return true;
            }
            let st = e.message[0].text.replace(/给我(涩|色)图/g, "").trim();
            if(st <= 0 || st > 101){
                await e.reply(`你的要求不合理请重试`)
                return true;
            }
            await e.reply(`好的,${bot}马上给你${st}张涩图`)
            let url;
            if(ss == 2){
                url = await(await fetch('https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0')).json();
            }
            if(ss == 0){
            url = 'https://api.sdgou.cc/api/tao/'}
            else{
                url = `https://iw233.cn/API/Random.php`;
            }
            let msgList = []
          const forwarder =
          botsender
            ? { nickname: Bot.nickname, user_id: Bot.uin }
            : {
              nickname: this.e.sender.card || this.e.user_id,
              user_id: this.e.user_id,
            };
          for(let i = 1; i <= st; i++){
            msgList.push({
              message: segment.image(url),
              ...forwarder,
            });
          }
          let y = await e.reply(await e.group.makeForwardMsg(msgList))
          let ee = await getread()
          if (ee != 0 && y && y.message_id) {
            let target = e.group;
            setTimeout(() => {
                target.recallMsg(y.message_id);
            }, ee);
        }
          return;}
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
/** 读取 */
function getread() {
    try {
      var fileContents = fs.readFileSync(path, 'utf8');
    } catch (e) {
      console.log(e);
      return false;
    }
    //转换
    return YAML.parse(fileContents);
  }
  
  /** 写入 */
  function getwrite(data) {
    try {
      //转换
      let yaml = YAML.stringify(data);
      fs.writeFileSync(path, yaml, 'utf8');
      return true
    } catch (e) {
      //错误处理
      console.log(e);
      return false
    }
  }