import plugin from "../../../lib/plugins/plugin.js"
import moment from "moment"
export class time extends plugin {
  constructor() {
    super({
      name: "时间",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#*几点了$",
          fnc: "time"
        }
      ]
    })
  }

  async time(e) { return e.reply(moment(new Date().getTime()).format("现在是" + "HH" + "点" + "mm" + "分" + "ss" + "秒").replace(/是0/g, "是").replace(/点0/g, "点")) }
}
