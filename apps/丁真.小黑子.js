import fetch from "node-fetch";
import { Config} from '../components/index.js'
import fs from 'node:fs'
const xhz_path ='plugins/hs-qiqi-plugin/resources/小黑子图片/'
const dz_path ='plugins/hs-qiqi-plugin/resources/丁真图片/'
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
        event: 'message',
        /** 优先级，数字越小等级越高 */
        priority: 10,
        rule: [
          {
            reg: '^上传坤图$',
            fnc: 'kt'
          },
          {
            reg: '^爱坤(图片)?列表$',
            fnc: 'sf'
          },
          {
            reg: '^删除坤图(\\d)+$',
            fnc: 'sc'
          },
          {
            /** 命令正则匹配 */
            reg: '^((.*)鸡你太美(.*)|(.*)坤坤(.*)|(.*)小黑子(.*)|(.*)鲲鲲(.*)|(.*)鸽鸽(.*))$',
            /** 执行方法 */
            fnc: 'jntm'
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
async sf(e){
  if(!Config.getConfig('set','pz')['dz']) return this.reply('一眼丁真功能已关闭')
  if (!e.isMaster)  {return false}
      let msglist = []
      try{
      let File = fs.readdirSync(xhz_path)
      if(File.length==0){
      e.reply('目前一张图都没有请使用上传坤图')
      return true
      }
      msglist.push(`坤坤图片共${File.length}张，可输入【删除坤坤图片+(序列号)】进行删除`)
      for (let i = 0; i < File.length; i++) {
        msglist.push([`${i+1}.`, segment.image(`file://${xhz_path}${File[i]}`)])
      }
  
      let msgRsg = await e.reply(await co.makeForwardMsg(e, msglist))
      if (!msgRsg)  e.reply('可能风控了，私聊查看试试', true)
    }catch(err) {
        logger.error(err)
    }
  }
  async sc(e){
    if(!Config.getConfig('set','pz')['dz']) return this.reply('一眼丁真功能已关闭')
  if (!e.isMaster)  {return false}
      //获取序号
      let num = e.msg.match(/\d+/)
      if (!num) {
      return  e.reply('没序列号要不先【坤坤图片列表】查看下图片对应的序列号...')
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
     let msg = [segment.at(e.user_id), segment.image('file://' + xhz_path + file[imgnum])]
     await e.reply(msg);
    return true; //返回true 阻挡消息不再往下
}

async dz(e) {
	if(!Config.getConfig('set','pz')['dz']) {return false} 
    let file = fs.readdirSync(dz_path)
    let imgnum = Math.round(Math.random() * (file.length - 1))
    let msg = [segment.at(e.user_id), segment.image('file://' + dz_path + file[imgnum])]
    await e.reply(msg);
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