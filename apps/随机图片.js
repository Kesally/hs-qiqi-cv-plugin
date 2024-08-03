import fs from "node:fs"
import Yaml from "../model/Yaml.js"
import YAML from "yaml"
import co from "../../../lib/common/common.js"
import { Config } from "../components/index.js"
import { promisify } from "util"
import { pipeline } from "stream"
const xhz_path = "plugins/hs-qiqi-plugin/resources/随机图片/"
let source = {}
let path_ = "./plugins/hs-qiqi-plugin/config/开启随机图.yaml"
let path = "./plugins/hs-qiqi-plugin/config/配置/随机图片.yaml"

if (!fs.existsSync(path_)) { fs.writeFileSync(path_, "") }
await tp()
export class example extends plugin {
  constructor() {
    super({
      name: "[枫叶]随机图片",
      dsc: "概率发送图片",
      event: "message",
      priority: 5888,
      rule: [
        {
          reg: "^(开启|关闭)本群随机图$",
          fnc: "kq",
          permission: "master"
        },
        {
          reg: "^上传随机图$",
          fnc: "kt"
        },
        {
          reg: "^随机(图片)?列表$",
          fnc: "sf"
        },
        {
          reg: "^删除随机图片(\\d)+$",
          fnc: "sc"
        },
        {
          reg: "^随机图片概率(.*)$",
          fnc: "sj"
        },
        {
          reg: "^随机图片帮助$",
          fnc: "bz"
        },
        {
          fnc: "sjtp",
          log: false
        }
      ]
    })
  }

  /**
   * 开启随机图
   * @param {object} e 消息事件
   */
  async kq(e) {
    if (!Config.getConfig("set", "pz").sjtp) { return false }
    let data = await getread()
    if (!data) data = []
    if (e.isMaster && e.msg.includes("关闭本群随机图")) {
      await data.push(e.group_id)
      getwrite(data)
      await e.reply("已关闭本群随机图")
    }
    if (e.isMaster && e.msg.includes("开启本群随机图")) {
      await data.splice(data.indexOf(e.group_id), 1)
      getwrite(data)
      await e.reply("已开启本群随机图")
    }
  }

  /**
   * 随机图帮助
   * @param {object} e 消息事件
   */
  async bz(e) {
    if (!Config.getConfig("set", "pz").sjtp) { return false }
    if (!e.isMaster) { e.reply("你不能用叫主人来"); return true }
    let data = await Yaml.getread(path)
    let ee = data.随机图概率 * 1
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
        message: "=====枫叶随机图片帮助====="
      }
    ]
    let msg = []
    let ui = []
    msg.push("1,上传随机图\n2,删除随机图片\n3.随机图片列表\n(开启|关闭)本群随机图")
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

  /**
   * 随机图列表
   * @param {object} e 消息事件
   */
  async sf(e) {
    if (!Config.getConfig("set", "pz").sjtp) { return false }
    if (!e.isMaster) { return false }
    let msglist = []
    try {
      let File = fs.readdirSync(xhz_path)
      if (File.length == 0) {
        e.reply("目前一张图都没有请使用上传随机图")
        return true
      }
      msglist.push(`随机图片共${File.length}张，可输入【删除随机图片+(序列号)】进行删除`)
      for (let i = 0; i < File.length; i++) {
        msglist.push([ `${i + 1}.`, segment.image(`file://${xhz_path}${File[i]}`) ])
      }

      let msgRsg = await e.reply(await co.makeForwardMsg(e, msglist))
      if (!msgRsg) e.reply("可能风控了，私聊查看试试", true)
    } catch (err) {
      logger.error(err)
    }
  }

  /**
   * 删除随机图
   * @param {object} e 消息事件
   */
  async sc(e) {
    if (!Config.getConfig("set", "pz").sjtp) { return false }
    if (!e.isMaster) { return false }
    // 获取序号
    let num = e.msg.match(/\d+/)
    if (!num) {
      return e.reply("没序列号要不先【随机图片列表】查看下图片对应的序列号...")
    }
    try {
      let File = fs.readdirSync(xhz_path)
      fs.unlinkSync(`${xhz_path}${File[num - 1]}`)
      await e.reply("删除成功")
    } catch (err) {
      e.reply("删除失败，请检查序列号是否正确")
    }
  }

  /**
   * 上传随机图
   * @param {object} e 消息事件
   */
  async kt(e) {
    if (!Config.getConfig("set", "pz").sjtp) { return false }
    if (!e.isMaster) return e.reply("只有主人能上传!!!")
    // cv花生
    if (e.isGroup) {
      source = (await e.group.getChatHistory(e.source?.seq, 1)).pop()
    } else {
      source = (await e.friend.getChatHistory((e.source?.time + 1), 1)).pop()
    }
    let imageMessages = []
    if (source) {
      for (let val of source.message) {
        if (val.type === "image") {
          imageMessages.push(val.url)
        } else if (val.type === "xml") {
          let resid = val.data.match(/m_resid="(.*?)"/)[1]
          if (!resid) break
          let message = await Bot.getForwardMsg(resid)
          for (const item of message) {
            for (const i of item.message) {
              if (i.type === "image") {
                imageMessages.push(i.url)
              }
            }
          }
        }
      }
    } else {
      imageMessages = e.img
    }
    if (!imageMessages.length) return e.reply("消息中未找到图片，请将要发送的图片与消息一同发送或者引用要添加的图像哟~")
    try {
      let savePath
      let File
      if (!fs.existsSync(xhz_path)) fs.mkdirSync(xhz_path)
      for (let i = 0; i < imageMessages.length; i++) {
        File = fs.readdirSync(xhz_path)
        savePath = `${xhz_path}${File.length + 1}.jpg`
        await co.downFile(imageMessages[i], savePath)
      }
      e.reply(`上传随机图片${imageMessages.length}张成功`)
    } catch (err) {
      logger.error(err)
      e.reply("上传随机图片失败")
    }
    return true
  }

  /**
   * 设置随机概率
   * @param {object} e 消息事件
   */
  async sj(e) {
    if (!Config.getConfig("set", "pz").sjtp) { return false }
    if (!e.isMaster) { e.reply("你不能用叫主人来"); return true }
    let sj = e.message[0].text.replace(/随机图片概率/g, "").trim()
    sj = sj * 1
    if (sj > 100 || sj < 0) { return e.reply("概率不能超过100或低于0") }
    let data = await Yaml.getread(path)
    data.随机图概率 = sj
    await Yaml.getwrite(path, data)
    await e.reply(`当前图片回复概率为${sj}%`)
    return true
  }

  async sjtp(e) {
    if (!Config.getConfig("set", "pz").sjtp) { return false }
    let group = await getread()
    try {
      for (let pp of group) {
        if (e.group_id == pp) {
          return true
        }
      }
    } catch (e) {}
    let data = await Yaml.getread(path)
    let ss = data.随机图概率
    let num = Math.ceil(Math.random() * 100)
    if (num <= ss) {
      let file = fs.readdirSync(xhz_path)
      let imgnum = Math.round(Math.random() * (file.length - 1))
      let msg = segment.image("file://" + xhz_path + file[imgnum])
      await e.reply(msg)
    } else {
      return false
    }
  }
}

async function tp() {
  if (!fs.existsSync(xhz_path)) {
    fs.mkdirSync(xhz_path)
    try {
      let streamPipeline = promisify(pipeline)
      let picPath = `${xhz_path}/1.jpg`
      await streamPipeline(fs.createWriteStream(picPath))
    } catch (err) {}
  }
}
/** 读取 */
function getread() {
  try {
    let fileContents = fs.readFileSync(path_, "utf8")
    // 转换
    return YAML.parse(fileContents)
  } catch (e) {
    console.log(e)
    return false
  }
}
/**
 * 写入
 * @param data
 */
function getwrite(data) {
  try {
    // 转换
    let yaml = YAML.stringify(data)
    fs.writeFileSync(path_, yaml, "utf8")
    return true
  } catch (e) {
    // 错误处理
    console.log(e)
    return false
  }
}
