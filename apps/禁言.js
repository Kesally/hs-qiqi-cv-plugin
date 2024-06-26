import plugin from "../../../lib/plugins/plugin.js"
import fs from "fs"
import YAML from "yaml"
import common from "../../../lib/common/common.js"

let path = "./plugins/hs-qiqi-plugin/resources/禁言.yaml"

if (!fs.existsSync(path)) { fs.writeFileSync(path, "") }

export class ztwd extends plugin {
  constructor() {
    super({
      name: "禁言",
      dsc: "",
      event: "message.group",
      priority: 1,
      rule: [
        {
          reg: "^(闭嘴|放开).*$",
          fnc: "z"
        },
        {
          reg: "",
          fnc: "t",
          log: false
        }
      ]
    })
  }

  async z(e) {
    if (!e.group.is_owner && !e.group.is_admin) { return false }
    let used = await getread()
    let op = e.user_id
    if (used == op) {
      await common.sleep(0)
      e.group.recallMsg(e.message_id)
      return true
    }
    if (!e.isMaster) {
      e.reply("你几把谁啊，我要见我主人")
      return true
    }
    let data = await getread()
    if (!data) data = []
    let A = e.message[0].text.replace(/闭嘴/g, "").trim()
    if (e.message[1]) {
      let atItem = e.message.filter((item) => item.type === "at")
      A = atItem[0].qq
    } else {
      A = A.match(/[1-9]\d*/g)
    }
    if (!A) return e.reply("你自己看看这是QQ号吗")
    A = parseInt(A)
    if (data.indexOf(A) == -1 && e.msg.includes("闭嘴")) {
      if (A != "") {
        await data.splice(data.indexOf(A), 1)
      }
      await data.push(A)
      await e.reply(`好的主人从现在开始让(${A})闭嘴`)
    }
    if (data.indexOf(A) !== -1 && e.msg.includes("放开")) {
      await data.splice(data.indexOf(A), 1)
      await e.reply(`好吧,放开(${A})`)
    }
    getwrite(data)
  }

  async t(e) {
    if (!e.group.is_owner && !e.group.is_admin) { return false }
    let used = await getread()
    let op = e.user_id
    try {
      for (let Q of used) {
        if (op == Q && !e.isMaster) {
          await common.sleep(0)
          e.group.recallMsg(e.message_id)
        } else {
          return false
        }
      }
    } catch (e) {
      return false
    }
    return false
  }
}

/** 读取 */
function getread() {
  try {
    let fileContents = fs.readFileSync(path, "utf8")
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
    fs.writeFileSync(path, yaml, "utf8")
    return true
  } catch (e) {
    // 错误处理
    console.log(e)
    return false
  }
}
