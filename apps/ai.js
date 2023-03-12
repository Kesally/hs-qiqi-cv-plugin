import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import fetch from 'node-fetch'
import { Config} from '../components/index.js'
import _ from 'lodash'
import cfg from '../../../lib/config/config.js'
import Yaml from '../model/Yaml.js'
import YAML from 'yaml'
import fs from 'fs'
if(Config.getConfig('set','mz')['botname']==null){
  logger.info('【枫叶插件】检测到未设置机器人名字')
  logger.info(' 请发送：枫叶设置，查看名字')
}
let bot = Config.getConfig('set','mz')['botname']  //这里是你的想要的机器人名称，将作为触发前缀
let path_='plugins/hs-qiqi-plugin/resources/openapikey.yaml'
let path='./plugins/hs-qiqi-plugin/config/配置/ai.yaml'
if (!fs.existsSync(path_)) {fs.writeFileSync(path_,'')}


var tempMsg = ""

const _path = process.cwd();



export class ai extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '小爱ai',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 58888,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^ai只回复.*$',
          /** 执行方法 */
          fnc: 'hf',permission: 'master'//绝对主人限制
        },
        {
          /** 命令正则匹配 */
          reg: '^切换ai$',
          /** 执行方法 */
          fnc: 'qh',permission: 'master'//绝对主人限制
        },
       {
          /** 命令正则匹配 */
          reg: '^ai回复概率(\\d)*(％|%)?$',
          /** 执行方法 */
          fnc: 'gailv',permission: 'master'//绝对主人限制
        },{
          /** 命令正则匹配 */
          reg: '^(开启|关闭)ai概率语音$',
          /** 执行方法 */
          fnc: 'gl',permission: 'master'//绝对主人限制
        },{
          /** 命令正则匹配 */
          reg: '^(开启|关闭)ai全局模式$',
          /** 执行方法 */
          fnc: 'qj',permission: 'master'//绝对主人限制
        },
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
        },{
          /** 命令正则匹配 */
          reg: '',
          /** 执行方法 */
          fnc: 'xiaoai'
        },
      ]
    })
  }
  async hf (e){
    let data=await Yaml.getread(path)
    let A = e.message[0].text.replace(/ai只回复/g, "").trim()
      if(e.message[1]){
      let atItem = e.message.filter((item) => item.type === "at");
      A = atItem[0].qq;
      }else{
        A = A.match(/[1-9]\d*/g)
      }
      if (!A) return e.reply("你自己看看这是QQ号吗")
      A = parseInt(A);
      data.指定 = A;
      await Yaml.getwrite(path,data)
      await e.reply(`好的主人现在我只回复${A}的`)
  }
async qh(e){
  let data=await Yaml.getread(path)
      let oo = data.切换
      if(oo < 2){
        oo = oo + 1;
        data.切换 = oo;
        await Yaml.getwrite(path,data)
      }else if(oo >= 2){
        oo = 0;
        data.切换 = oo;
        await Yaml.getwrite(path,data)
      }
      if(oo == 0){
        e.reply('切换成功当前ai为小爱')
      }else if(oo == 1){
        let key = await getread();
        if(key == ''){
          data.切换 = 2;
          await Yaml.getwrite(path,data)
          e.reply('你还没有激活openai,发送openai帮助激活后使用,已自动切换为青云客ai')
        }
        e.reply('切换成功当前ai为openai,记得前缀带上机器人名字哦')
      }else if(oo == 2){
        e.reply('切换成功当前ai为青云客')
      }
      return true;
}
 async gailv (e) {
 
	 if(e.msg.includes('ai回复概率')){
		let gailv = e.msg.replace(/ai回复概率|%|％/g,'').trim();
		 gailv = Number(gailv)
		 if(gailv > 100){
			 e.reply('最高100~')
			 return
		 }
		  if(gailv < 0){
			 e.reply('不可以低于0!')
			 return
		 }
         await  redis.set('aigailv:ai', gailv)
		await e.reply(`ai回复概率成功设置为${gailv}%`)
		 
	 }
	 
	 
 }
 async qj(e) {
 
 if(e.msg.includes('开启')){
       await  redis.set('aiqj:ai', '1')
       await  e.reply('已开启ai全局模式~')
      } else if(e.msg.includes('关闭')){
       await  redis.set('aiqj:ai', '0')
        await  e.reply('已关闭ai全局模式~')
      }
      return true
}
  async gl (e) {
 
 if(e.msg.includes('开启')){
       await  redis.set('aiyy:ai', '1')
       await  e.reply('已开启ai概率回复语音~')
      } else if(e.msg.includes('关闭')){
       await  redis.set('aiyy:ai', '0')
        await  e.reply('已关闭ai概率回复语音~')
      }
      return true
}
  async xiaoai (e) {
    let qj =await redis.get('aiqj:ai')
    let data=await Yaml.getread(path)
    let rr = data.指定;
    let op = e.user_id;
           if(op == rr){
             answer(e);
             return true;
       }
    //判断概率
  let gailv = await  redis.get('aigailv:ai')
  let sz = Math.ceil(Math.random()* 100)
   if(!gailv){gailv=100}
   if(gailv<sz||gailv==0){return false}
 //过滤信息
if (!e.msg || e.msg.charAt(0) == '#') {
		    return  false
		     }
//过滤文字
if(e.msg.includes('疫情')){
       return false
      }
 //过滤100以内的数字，避免与小飞的点歌序号起冲突
 if(/^([0-9]|[0-9][0-9])$/.test(this.e.msg)){
		return false
		}
//避免 群友引用回复机器人发的图片 触发ai回复
	if(e.source){
	if (/^\[图片]$/.test(e.source.message)) {
    return 
 }}
 //判断全局
 let name =Config.getConfig('set','mz')['botname']
	  if(!qj || qj==0){ 
     if(e.isPrivate||e.msg.includes(name) ||(e.atBot && e.msg)){
       answer(e)
   	 return true
   	 }else{return false}
    }else if(qj==1){
       answer(e)
   	 return true
       }
       
    }
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
    if(!Config.getConfig('set','pz')['openai']) {return false}
    let data=await Yaml.getread(path)
    let yy = data.切换;
    if(yy != 1){
      return true;
    }
    let key = await getread();
    let apikey = `${key}` //这里填你的apikey，在openai官网申请的apikey
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
    let data=await Yaml.getread(path)
    let yy = data.切换;
    if(yy != 1){
      return true;
    }
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
        res = await fetch('https://api.openai.com/v1/completions', {
            method: "post",
            body: JSON.stringify(data2),
    
            headers: {
                'Content-Type': "application/json", 
               
                'Authorization':'Bearer '+apikey
            }

        })
       
    } catch (err) {
        logger.info(err)
        logger.info('openai访问失败');
        return false
    }
    let res2 =await res.json()
  let jieguo
    try {
   jieguo = res2.choices[0].text
    }
    catch (err){
    e.reply('openai访问失败，请检查你输入的openai是否正确，或者可能是你的openai已经没有额度了\n如需使用请访问https://docs.qq.com/doc/DR0NkS090ZkFMRmRU');
    logger.error('\nopenai访问失败，请检查你输入的openai是否正确，或者可能是你的openai已经没有额度了\n');
   return true
    }
    jieguo = jieguo.replace(/\n/ , "").trim()
    jieguo = jieguo.replace(/答：/ , "").trim()
    jieguo = jieguo.replace(/Bot:/ , "").trim()
    jieguo = jieguo.replace(/robot:/ , "").trim()
    jieguo = jieguo.replace(/Robot:/ , "").trim()
jieguo = jieguo.replace(/Computer:/ , "").trim()
jieguo = jieguo.replace(/computer:/ , "").trim()
    jieguo = jieguo.replace(/AI:/ , "").trim()
    jieguo = jieguo.replace(/一个聊天机器人/, bot).trim()
    jieguo = jieguo.replace(/聊天机器人/, bot).trim()
    jieguo = jieguo.replace(/机器人:/, '').trim()
    jieguo = jieguo.replace(/机器人：/, '').trim()
    tempMsg = tempMsg + "\n\n " + jieguo
    // logger.mark(`[AI回复]${tempMsg}`)
    e.reply(jieguo,true)
    //console.log(res2.choices[0])
   return true
  }}}


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
/** 读取 */
function getread() {
  try {
    var fileContents = fs.readFileSync(path_, 'utf8');
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
    fs.writeFileSync(path_, yaml, 'utf8');
    return true
  } catch (e) {
    //错误处理
    console.log(e);
    return false
  }
}
async function answer(e) {
  let num = Math.ceil(Math.random()* 4)
  let name =Config.getConfig('set','mz')['botname']
  e.msg=e.msg.replace(`${name}`, "小爱")
  let data=await Yaml.getread(path)
  let uu = data.切换;
  let res;
  if(uu == 0){
  res = await(await fetch(`http://api.duozy.cn/api/xiaoai.php?msg=${e.msg}`)).json();
  //判断是否关闭语音
  let yy =await redis.get('aiyy:ai')
  let qd=1
  if(!yy|| yy==0){
  qd =2
  if(res)	{
    let msg = res.text.replace(/菲菲|小思|小爱/g,name).replace(/小爱/g, name).replace(/小米/g, '').replace(/对不起，暂不支持该功能，你和我聊点儿别的吧/g,`${name}听不明白(⇀‸↼‶)`)
    if(qd == 1&&num==1&&uu==0){
      msg = res.mp3
      e.reply(segment.record(msg))
      return true
    }else{
    e.reply(msg)
    }
   }
  }}else if(uu == 2){
    let Msg = e.msg.replace(name, "菲菲");
    res = await(await fetch(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${Msg}`)).json();
    if (res) {
      if (res.result == 0) {
        res.content = res.content.replace(/菲菲/g, name);
        e.reply(res.content);
        return true
      }
    }
  }}	