import { segment } from "oicq";//导包部分
import fs from 'node:fs'
const xhz_path ='plugins/hs-qiqi-plugin/resources/随机图片/'
let source={}
import YAML from 'yaml'
import co from '../../../lib/common/common.js'
let path='./plugins/hs-qiqi-plugin/config/随机表情概率.yaml'
import { Config} from '../components/index.js'

if (!fs.existsSync(path)) {fs.writeFileSync(path,'')}
await tp()
export class example extends plugin {
    constructor () {
      super({
        /** 功能名称 */
        name: '[枫叶]随机图片',
        /** 功能描述 */
        dsc: '概率发送图片',
        /** https://oicqjs.github.io/oicq/#events */
        event: 'message',
        /** 优先级，数字越小等级越高 */
        priority: 10,
        rule: [
          {
            reg: '^上传随机图$',
            fnc: 'kt'
          },
          {
            reg: '^随机(图片)?列表$',
            fnc: 'sf'
          },
          {
            reg: '^删除随机图片(\\d)+$',
            fnc: 'sc'
          },
          {
            reg: '^随机图片概率(.*)$',
            fnc: 'sj'
          },
          {
            reg: '^随机图片帮助$',
            fnc: 'bz'
          },
          {
            /** 命令正则匹配 */
            reg: '',
            /** 执行方法 */
            fnc: 'sjtp'
          },            
        ]
    })
}
async bz(e){
    if(!Config.getConfig('set','pz')['sjtp']){return false}
    if(!e.isMaster){e.reply('你不能用叫主人来'); return true;}
    let ee = await getread();
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
                  message: '=====枫叶随机图片帮助====='
                }
              ]
            let msg = [];
            let ui =[];
            msg.push(`1,上传随机图\n2,删除随机图片\n3.随机图片列表`)
            ui.push(`当前随机图片概率为${ee}%\n可发送随机图片概率.更改`)
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
async sf(e){
    if(!Config.getConfig('set','pz')['sjtp']){return false}
  if (!e.isMaster)  {return false}
      let msglist = []
      try{
      let File = fs.readdirSync(xhz_path)
      if(File.length==0){
      e.reply('目前一张图都没有请使用上传随机图')
      return true
      }
      msglist.push(`随机图片共${File.length}张，可输入【删除随机图片+(序列号)】进行删除`)
      for (let i = 0; i < File.length; i++) {
        msglist.push([`${i+1}.`, segment.image(`${xhz_path}${File[i]}`)])
      }
  
      let msgRsg = await e.reply(await co.makeForwardMsg(e, msglist))
      if (!msgRsg)  e.reply('可能风控了，私聊查看试试', true)
    }catch(err) {
        logger.error(err)
    }
  }
  async sc(e){
    if(!Config.getConfig('set','pz')['sjtp']){return false}
  if (!e.isMaster)  {return false}
      //获取序号
      let num = e.msg.match(/\d+/)
      if (!num) {
      return  e.reply('没序列号要不先【随机图片列表】查看下图片对应的序列号...')
      }
      try{
      let File = fs.readdirSync(xhz_path)
      fs.unlinkSync(`${xhz_path}${File[num - 1]}`)
   await e.reply('删除成功')
      } catch(err) {
        e.reply('删除失败，请检查序列号是否正确')
      }
  }
  
async kt(e){
    if(!Config.getConfig('set','pz')['sjtp']){return false}
    if(!e.isMaster) return e.reply('只有主人能上传!!!')
    //cv花生
    if (e.isGroup) {
          source = (await e.group.getChatHistory(e.source ?.seq, 1)).pop()
        }else{
          source = (await e.friend.getChatHistory((e.source ?.time + 1), 1)).pop()
    }
    let imageMessages = []
    if (source) {
          for (let val of source.message) {
            if (val.type === 'image') {
              imageMessages.push(val.url)
            }else if (val.type === 'xml') {
             let resid = val.data.match(/m_resid="(.*?)"/)[1]
              if (!resid) break
              let message = await Bot.getForwardMsg(resid)
              for (const item of message) {
                for (const i of item.message) {
                  if (i.type === 'image') {
                    imageMessages.push(i.url)
                  }
                }
          }      
        }
      }
    }else{
        imageMessages = e.img
    }
    if (!imageMessages.length) return e.reply('消息中未找到图片，请将要发送的图片与消息一同发送或者引用要添加的图像哟~')
    try{
        let savePath
        let File
        if(!fs.existsSync(xhz_path)) fs.mkdirSync(xhz_path)
        for (let i = 0; i < imageMessages.length; i++) {
            File = fs.readdirSync(xhz_path)
            savePath = `${xhz_path}${File.length + 1}.jpg`
            await co.downFile(imageMessages[i], savePath)
          }
          e.reply(`上传随机图片${imageMessages.length}张成功`)
        } catch (err) {
          logger.error(err)
          e.reply('上传随机图片失败')
        }
        return true
}
async sj(e){
    if(!Config.getConfig('set','pz')['sjtp']){return false}
    if(!e.isMaster){e.reply('你不能用叫主人来'); return true;}
  let data=await getread()
  if (!data) data= [];
  let sj = e.message[0].text.replace(/随机图片概率/g, "").trim();
  if(sj > 100 || sj < 0){return e.reply('概率不能超过100或低于0')}
  if(sj != ''){
    await data.splice(data.indexOf(sj), 1)
}
    await data.push(sj);
    await e.reply(`当前图片回复概率为${sj}%`)
     getwrite(data)
     return true;
}
async sjtp(e) {
    if(!Config.getConfig('set','pz')['sjtp']){return false}
    if(!e.isMaster){e.reply('你不能用叫主人来'); return true;}
    logger.info('[枫叶]随机图片')
  let oo = await getread()
  let num = Math.ceil(Math.random( )* 100)
  if(num <= oo){
  let file = fs.readdirSync(xhz_path)
     let imgnum = Math.round(Math.random() * (file.length - 1))
     let msg = segment.image(xhz_path + file[imgnum])
     await e.reply(msg);}else{
      return false;
    }
}}

 async function tp() {
  if (!fs.existsSync(xhz_path)) {
    fs.mkdirSync(xhz_path)
    try{
    let streamPipeline = promisify(pipeline)
    let picPath = `${xhz_path}/1.jpg`
    await streamPipeline(fs.createWriteStream(picPath))
    }catch(err) {}
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