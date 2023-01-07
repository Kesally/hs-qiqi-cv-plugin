import { segment } from "oicq";//导包部分
import fetch from "node-fetch";
import { Config} from '../components/index.js'
import fs from 'node:fs'
const xhz_path ='plugins/hs-qiqi-plugin/resources/小黑子图片/'
let source={}
import co from '../../../lib/common/common.js'

await tp()
export class example extends plugin {
    constructor () {
      super({
        /** 功能名称 */
        name: '一眼丁真',
        /** 功能描述 */
        dsc: '每日一张丁真图片或坤坤图片',
        /** https://oicqjs.github.io/oicq/#events */
        event: 'message',
        /** 优先级，数字越小等级越高 */
        priority: 10,
        rule: [
          {
            /** 命令正则匹配 */
            reg: '^((.*)鸡你太美(.*)|(.*)坤坤(.*)|(.*)小黑子(.*)|(.*)鲲鲲(.*)|(.*)鸽鸽(.*))$',
            /** 执行方法 */
            fnc: 'jntm'
          },
          {
            reg: '^上传坤图$',
            fnc: 'kt'
          },
          {
                /** 命令正则匹配 */
                reg: '^((.*)一眼丁真(.*)|(.*)雪豹闭嘴(.*)|(.*)芝士雪豹(.*)|(.*)雪豹(.*)|(.*)讨口子(.*))$',
                /** 执行方法 */
                fnc: 'dz'
          },{
                 reg: "^丁真帮助",
                 fnc: 'dzbz'
            }
            
        ]
    })
}
async kt(e){
  if(!Config.getConfig('set','pz')['dz']) return this.reply('一眼丁真功能已关闭')
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
          e.reply(`上传坤坤图片${imageMessages.length}张成功`)
        } catch (err) {
          logger.error(err)
          e.reply('上传坤坤图片失败')
        }
        return true
}
async dzbz () {
     if(!Config.getConfig('set','pz')['dz']) return this.reply('一眼丁真功能已关闭')
	 this.reply('发送一眼丁真.雪豹闭嘴.芝士雪豹.讨口子.鸡你太美.坤坤.小黑子.鲲鲲.鸽鸽.触发表情,全文匹配')
  }
async jntm(e) {
	if(!Config.getConfig('set','pz')['dz']) {return false}
  let file = fs.readdirSync(xhz_path)
     let imgnum = Math.round(Math.random() * (file.length - 1))
     let msg = [segment.at(e.user_id), segment.image(xhz_path + file[imgnum])]
     await e.reply(msg);
    return true; //返回true 阻挡消息不再往下
}

async dz(e) {
	if(!Config.getConfig('set','pz')['dz']) {return false} 
    let timeout = 0; //0表示不撤回，单位毫秒
    let url = await(await fetch('https://api.micrsky.com/dzimgs')).json();
    let msg=[segment.at(e.user_id),	  
        segment.image(url)]
      let msgRes = await e.reply(msg);
      if (timeout!=0 && msgRes && msgRes.message_id){
        let target = null;
        if (e.isGroup) {
          target = e.group;
        }else{
          target = e.friend;
        }
        if (target != null){
          setTimeout(() => {
            target.recallMsg(msgRes.message_id);
            target.recallMsg(e.message_id);
          }, timeout);
        }
      } 
      return true; //返回true 阻挡消息不再往下
  }
 }
 
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