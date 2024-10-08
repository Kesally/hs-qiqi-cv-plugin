import fs from "fs"
import YAML from "yaml"
import cfg from "../../../lib/config/config.js"

let path = "./plugins/hs-qiqi-plugin/config/禁言.yaml"

if (!fs.existsSync(path)) fs.writeFileSync(path, "")

export class ztwd extends plugin {
  constructor() {
    super({
      name: "闭嘴",
      dsc: "撤回不听话的群友的所有消息",
      event: "message.group",
      priority: 5,
      rule: [
        {
          reg: "^#(闭嘴|放开)",
          fnc: "set"
        }
      ]
    })
  }

  /**
   * 闭嘴/放开
   * @param {object} e 消息事件
   */
  async set(e) {
    if (!e.group.is_owner && !e.group.is_admin) return false

    let data = await getread() || []
    if (data.includes(e.user_id)) {
      e.group.recallMsg(e.message_id)
      return true
    }

    if (!e.isMaster) return e.reply("你几把谁啊，我要见我主人")

    let id = e.msg.replace(/^#(闭嘴|放开)/, "").trim() || e.at || e.message.find(item => item.type == "at")?.qq
    if (!id) return e.reply("请输入QQ或艾特不听话的群友哦")
    if (id == e.self_id) return e.reply("你干嘛！哎哟~")

    id = Number(id) || String(id)

    let msg
    if (e.msg.includes("闭嘴")) {
      if (cfg.masterQQ.includes(id)) return e.reply("小黑子想对主人做什么！")
      if (data.includes(id)) return e.reply("这个坏人已经是闭嘴状态啦")
      data.push(id)
      msg = `好的主人从现在开始让(${id})闭嘴啦`
    } else {
      data.splice(data.indexOf(id), 1)
      msg = `好吧,放开(${id})`
    }

    if (getwrite(data)) {
      return e.reply(msg)
    } else {
      return e.reply("啊偶，写入数据失败了，主人请查看日志错误")
    }
  }
}

Bot.on("message.group", e => {
  if (!e.group.is_owner && !e.group.is_admin) return false
  if (e.user_id == e.self_id) return false
  let data = getread() || []
  try {
    if (data.includes(e.user_id)) {
      logger.mark(`[hs-qiqi-plugin][禁言]撤回 ${logger.green(e.user_id)} 的消息，解除请发 #放开${e.user_id}`)
      e.group.recallMsg(e.message_id)
    } else {
      return false
    }
  } catch (e) {
    return false
  }
  return false
})

/** 读取禁言名单 */
function getread() {
  try {
    let fileContents = fs.readFileSync(path, "utf8")
    return YAML.parse(fileContents)
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 写入禁言名单
 * @param data - 写入的数据
 */
function getwrite(data) {
  try {
    let yaml = YAML.stringify(data)
    fs.writeFileSync(path, yaml, "utf8")
    return true
  } catch (err) {
    logger.error(err)
    return false
  }
}
