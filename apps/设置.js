import lodash from "lodash"
import { Config, Common } from "../components/index.js"

const cfgMap = {
  "随机图片": "pz.sjtp",
  "戳一戳": "pz.cyc",
  "机器人名字": "mz.botname",
  "丁真": "pz.dz",
  "数字炸弹": "pz.szzd",
  "随机类游戏": "pz.jryq",
  "涩涩": "pz.ss",
  "睡眠时间": "pz.smsj"
}
const ccc = {
  "随机图片": "sjtp",
  "戳一戳": "cyc",
  "丁真": "dz",
  "数字炸弹": "szzd",
  "随机类游戏": "jryq",
  "涩涩": "ss",
  "睡眠时间": "smsj"
}
const CfgReg = `^#?枫叶(插件)?设置\\s*(${lodash.keys(cfgMap).join("|")})?\\s*(.*)$`

export class fy_set extends plugin {
  constructor() {
    super({
      name: "枫叶插件_设置",
      dsc: "设置",
      event: "message",
      priority: 2000,
      rule: [
        {
          reg: CfgReg,
          fnc: "message",
          permission: "master"
        }, {
          reg: "^#?枫叶(开启|关闭)全部设置$",
          fnc: "All",
          permission: "master"
        }
      ]
    })
  }

  async message() {
    return await set(this.e)
  }

  async All(e) {
    let yes = 0
    if (e.msg.includes("开启全")) {
      yes = true
    }
    if (e.msg.includes("关闭全")) {
      yes = false
    }
    if (yes == true) {
      for (let i in ccc) {
        Config.modify("set.pz", ccc[i], yes)
      }
      await Setkq(this.e)
      return true
    } else if (yes == false) {
      for (let i in ccc) {
        Config.modify("set.pz", ccc[i], yes)
      }
      await Setgb(this.e)
      return true
    }
  }
}

async function set(e) {
  let reg = new RegExp(CfgReg).exec(e.msg)
  if (reg && reg[2]) {
    let val = reg[3] || ""
    let cfgKey = cfgMap[reg[2]]
    if (cfgKey == "mz.botname") {
      if (val == "") {
        e.reply("喂·喂·喂！我就不配有名字是吗？")
        return true
      }
    } else if (val.includes("开启") || val.includes("关闭")) {
      val = !/关闭/.test(val)
    } else {
      cfgKey = ""
    }

    if (cfgKey) {
      setCfg(cfgKey, val)
    }
  }

  let cfg = {}
  for (let name in cfgMap) {
    let key = cfgMap[name].split(".")[1]
    cfg[key] = getStatus(cfgMap[name])
  }

  // 渲染图像
  return await Common.render("admin/index", {
    ...cfg
  }, { e, scale: 1.2 })
}

function setCfg(rote, value, def = false) {
  let arr = rote?.split(".") || []
  if (arr.length > 0) {
    let type = arr[0]; let name = arr[1]
    let data = Config.getYaml("set", type, def ? "defSet" : "config") || {}
    data[name] = value
    Config.save("set", type, def ? "defSet" : "config", data)
  }
}

const getStatus = function(rote, def = false) {
  let _class = "cfg-status"
  let value = ""
  let arr = rote?.split(".") || []
  if (arr.length > 0) {
    let type = arr[0]; let name = arr[1]
    let data = Config.getYaml("set", type, def ? "defSet" : "config") || {}
    if (data[name] == true || data[name] == false) {
      _class = data[name] == false ? `${_class}  status-off` : _class
      value = data[name] == true ? "已开启" : "已关闭"
    } else {
      value = data[name]
    }
  }
  if (!value) {
    if (rote == "mz.botname") {
      value = ""
    } else {
      _class = `${_class}  status-off`
      value = "已关闭"
    }
  }

  return `<div class="${_class}">${value}</div>`
}
const allgb = "<div class=\"cfg-status status-off\">已关闭</div>"
const allkq = "<div class=\"cfg-status\" >已开启</div>"
async function Setgb(e) {
  if (!e.isMaster) return

  let cfg = {
    botname: getStatus("mz.botname"),
    cyc: allgb,
    laheici: allgb,
    dz: allgb,
    smsj: allgb,
    szzd: allgb,
    jryq: allgb,
    ss: allgb,
    sjtp: allgb
  }
  // 渲染图像
  return await Common.render("admin/index", {
    ...cfg
  }, {
    e,
    scale: 1.2
  })
}
async function Setkq(e) {
  if (!e.isMaster) return

  let cfg = {
    botname: getStatus("mz.botname"),
    cyc: allkq,
    laheici: allkq,
    dz: allkq,
    smsj: allkq,
    szzd: allkq,
    jryq: allkq,
    ss: allkq,
    sjtp: allkq
  }
  // 渲染图像
  return await Common.render("admin/index", {
    ...cfg
  }, {
    e,
    scale: 1.2
  })
}
