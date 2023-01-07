import plugin from '../../../lib/plugins/plugin.js'
import _ from 'lodash'
import fetch from "node-fetch";
import { Config} from '../components/index.js'
import { segment } from 'oicq';
import axios from 'axios'  //需要安装依赖 命令 cnpm install axios -w 或者 pnpm add axios -w(pnpm这个可能会掉依赖)
import fs from "node:fs"
import YAML from 'yaml'
let kg = 0
var tempMsg = ""
if(Config.getConfig('set','mz')['botname']==null){
  logger.info('【枫叶插件】检测到未设置机器人名字')
  logger.info(' 请发送：枫叶设置，查看名字')
}
let bot = Config.getConfig('set','mz')['botname']  //这里是你的想要的机器人名称，将作为触发前缀
let path='./plugins/hs-qiqi-plugin/resources/openapikey.yaml'
//const openAIAuth = await getOpenAIAuth({
// email: process.env.OPENAI_EMAIL,
// password: process.env.OPENAI_PASSWORD
//})
//const api = new ChatGPTAPI({ ...openAIAuth, markdown: false })1
//const conversation = api.getConversation()

if (!fs.existsSync(path)) {fs.writeFileSync(path,'')}
export class example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '[枫叶] openai',
      /** 功能描述 */
      dsc: 'chatgpt from openai',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "^我的key", //匹配消息正则,命令正则
          /** 执行方法 */
          fnc: 'k',
          permission: 'master'
        },
        {
          /** 命令正则匹配 */
          reg: "^#激活openai.*", //匹配消息正则,命令正则
          /** 执行方法 */
          fnc: 'tx',
          permission: 'master'
        },
        {
          /** 命令正则匹配 */
          reg: bot, //匹配消息正则,命令正则
          /** 执行方法 */
          fnc: 'sjha'
        }, {
          /** 命令正则匹配 */
          reg: "^#给我图.*", //匹配消息正则,命令正则
          /** 执行方法 */
          fnc: 'gt'
        }, {
          /** 命令正则匹配 */
          reg: "#重置对话", //匹配消息正则,命令正则
          /** 执行方法 */
          fnc: 'czdg'
        }
      ]
    })
  } w
  /**
   * 调用chatgpt接口
   * @param e oicq传递的事件参数e
   */
  async k(e){
    if(!Config.getConfig('set','pz')['openai']) {return false}
    let key = await getread();
    e.reply(`当前key为${key}`)
    return true;
  }
   async tx(e){
    if(!Config.getConfig('set','pz')['openai']) {return false}
    if(e.group){
      await e.reply('请私聊使用')
      return true;
  }
  let ck = e.message[0].text.replace(/#|激活openai/g, "").trim();
  let data=await getread();
  if (!data) data= [];
  if(ck != ''){
      await data.splice(data.indexOf(ck), 1)
  }
  await data.push(ck)
  e.reply(`输入成功当前key为${ck}`)
  getwrite(data)
  return true;
  }
  async czdg(e) {
	if(!Config.getConfig('set','pz')['openai']) {return false}
    tempMsg = ""
    e.reply('重置聊天对话啦')

  }
  //* 调用openai的接口
  async gt(e) {
    let key = await getread();
    let apikey = `${key}` //这里填你的apikey，在openai官网申请的apikey
    if(!Config.getConfig('set','pz')['openai']) {return false}
    let res = ""
    let mgs = e.msg.replace(/#给我图/g, "").trim()
    var data2 = {
      "prompt": mgs,
      "n": 1,
      "size": "512x512"
    }
    try {
      res = await fetch('https://api.openai.com/v1/images/generations', {
        method: "post",
        body: JSON.stringify(data2),

        headers: {
          'Content-Type': "application/json",
          'Authorization': 'Bearer ' + apikey
        }
      })
    } catch (err) {
      console.log(err)
      console.log('没有访问成功');
      kg = 0
      return
    }

    let res2 = await res.json()
    console.log(res2)
    try {
      let jieguo = res2.data[0].url

      let msg = segment.image(jieguo)
      // jieguo = jieguo.replace(/\n/ , "").trim()
      e.reply(msg, true)

    } catch {
      e.reply('找不到这张图')

    }

    //console.log(res2.choices[0])
    return false
  }

  async sjha(e) {
    logger.info('[枫叶]openai')
    if(!Config.getConfig('set','pz')['openai']) {return false}
    if (e.isMaster | e.isGroup) {
      let key = await getread();
      let apikey = `${key}` //这里填你的apikey，在openai官网申请的apikey
      let res = ""
      let msg = _.trimStart(e.msg, bot)
      tempMsg = tempMsg + "\nHuman: " + msg



      var data2 = {
        "model": "text-davinci-003",
        "prompt": tempMsg,
        "max_tokens": 2048,
        "temperature": 0,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0.6,
        "stop": [" Human:", " AI:"],
      }


      try {

      } catch {

      }
      axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
          'Content-Type': "application/json",
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length': 1024,
          'Transfer-Encoding': 'chunked',
          'Authorization': 'Bearer ' + apikey
        },
        data: JSON.stringify(data2)
      })
        .then(function (response) {
          let res2 = response.data

          let jieguo = res2.choices[0].text
          jieguo = jieguo.replace(/\n/, "").trim()
          jieguo = jieguo.replace(/答：/, "").trim()
          jieguo = jieguo.replace(/Bot:/, "").trim()
          jieguo = jieguo.replace(/robot:/, "").trim()
          jieguo = jieguo.replace(/Robot:/, "").trim()
          jieguo = jieguo.replace(/Computer:/, "").trim()
          jieguo = jieguo.replace(/computer:/, "").trim()
          jieguo = jieguo.replace(/AI:/, "").trim()


          tempMsg = tempMsg + "\nAI: " + jieguo
          let zs = tempMsg.length
          // logger.mark(`[AI回复]${tempMsg}`)
          ForwardMsg(e, jieguo)


        })
        .catch(function (error) {
          console.log(error);
          tempMsg = ""
          e.reply('超过上限,对话已重置')
        });




    }

  }



}


async function getAgent() {
  if(!Config.getConfig('set','pz')['openai']) {return false}
  let proxyAddress = cfg.bot.proxyAddress
  if (!proxyAddress) return null
  if (proxyAddress === 'http://0.0.0.0:0') return null



  if (HttpsProxyAgent === '') {
    HttpsProxyAgent = await import('https-proxy-agent').catch((err) => {
      logger.error(err)
    })

    HttpsProxyAgent = HttpsProxyAgent ? HttpsProxyAgent.default : undefined
  }

  if (HttpsProxyAgent) {
    return new HttpsProxyAgent(proxyAddress)
  }

  return null
}
async function imgUrlToBase64(url) {
	if(!Config.getConfig('set','pz')['openai']) {return false}
  let base64Img
  return new Promise(function (resolve, reject) {
    let req = http.get(url, function (res) {
      var chunks = [];
      var size = 0;
      res.on('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
        //累加缓冲数据的长度
      });
      res.on('end', function (err) {
        var data = Buffer.concat(chunks, size);
        base64Img = data.toString('base64');
        resolve({
          success: true,
          base64Img
        });
      });
    })
    req.on('error', (e) => {
      resolve({
        success: false,
        errmsg: e.message
      });
    });
    req.end();
  })
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}



async function ForwardMsg(e, data) {

  let msgList = [];
  
      msgList.push({
          message: data,
          nickname: Bot.nickname,
          user_id: Bot.uin,
      });
  
  if (msgList[0].message.length < 70) {
      await e.reply(msgList[0].message,true);
  } else {
      //console.log(msgList);
      let msg2 = await Bot.makeForwardMsg(msgList);
msg2.data = msg2.data.replace(/^<\?xml.*version=.*?>/g,'<?xml version="1.0" encoding="utf-8" ?>');
await e.reply(msg2)
      

  }
  return;
}
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