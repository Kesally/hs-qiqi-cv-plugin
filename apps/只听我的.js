import { createRequire } from "module"
const require = createRequire(import.meta.url)
const fs = require("fs")
let json = {}

export class sleepset extends plugin {
  constructor() {
    super({
      name: "只听我的",
      dsc: "枫叶_只听我的",
      event: "message",
      priority: -99999999999,
      rule: [

        {
          reg: "#?只听我的$",
          fnc: "ztwd"
        },
        {
          reg: "^#?听大家的$",
          fnc: "tdjd"
        },
        {
          reg: "^#?(屏蔽群列表|屏蔽列表)$",
          fnc: "list"
        },
        {
          fnc: "t",
          log: false
        }
      ]
    })
  }

  // 只听我的
  async ztwd(e) {
    if (!e.isMaster) return e.reply("哒咩！")
    let id = e.group_id // 创建对象
    json = await getdata(id, json, false)
    if (!json[id].sleep) { // 如果不是生效的对象
      json[id].sleep = true// 添加到列表
      json = await getdata(e.group_id, json, true) // 引入模块
      e.reply("好的主人，在这个群我只听你的~")// 发送消息
    } else { // 如果该群是生效的对象
      e.reply("不要再说啦~")// 发送消息
    }
    return true// 拦截
  }

  // 听大家的
  async tdjd(e) {
    if (!e.isMaster) return e.reply("哒咩！")
    let id = e.group_id // 创建对象
    json = await getdata(id, json, false) // 引用模块
    if (!json[id].sleep) { // 如果该群不是生效的对象
      e.reply("不要再说啦~")// 发送消息
    } else { // 如果是生效的对象
      json[id].sleep = false
      json = await getdata(e.group_id, json, true) // 引入模块
      e.reply("嗯~可以和大家一起玩咯~")// 发送消息
    }
    return true// 拦截
  }

  // 群聊拦截列表
  async list(e) {
    if (!e.isMaster) return e.reply("哒咩！") // 是否主人
    let id = e.group_id // 为当前群聊创建对象
    let sleepnum = 0 // 定义初始数值
    json = await getdata(id, json, false) // 引用模块
    let msg = "在以下群只听主人的话：\n"
    let list = Object.keys(json)// 获取群号
    for (let group of list) { // 遍历所有生效的对象
      if (json[group].sleep) {
        msg = msg + `${group}\n` // 拼接语句
        sleepnum++ // 完成循环累积数值
      }
    }
    if (sleepnum == 0) { // 如果值为0
      e.reply("在任何群都听大家的~")// 发送消息
    } else { // 反之
      e.reply(msg)// 发送组装的消息
    }
    return true// 拦截指令
  }

  // 实时监听
  async t(e) {
    if (e.isMaster) return false // 是否主人
    if (!e.isGroup) return false // 是否群聊
    let id = e.group_id // 创建对象
    json = await getdata(id, json, false) // 引用模块
    if (json[id].sleep) return true
    return false// 放行
  }
}

// 数据管理
async function getdata(id, json, save) {
  const dirpath = "resources"// 文件夹路径
  let Template = { "sleep": false } // 创建对象
  let filename = "sleep.json"// 文件名
  if (!save) {
    if (!fs.existsSync(dirpath)) { // 如果文件夹不存在
      fs.mkdirSync(dirpath)// 创建文件夹
    }
    if (!fs.existsSync(dirpath + "/" + filename)) { // 如果文件不存在
      fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({
      })) // 创建文件
    }
    json = JSON.parse(fs.readFileSync(dirpath + "/" + filename, "utf8"))// 读取文件
    if (!Object.prototype.hasOwnProperty.call(json, id)) {
    // 如果json中不存在该用户
      json[id] = Template
    }
    if (!json[id].local_gailv) { json[id].local_gailv = Template.gailv }
    if (!json[id].gailv) { json[id].gailv = Template.local_gailv }
    return json
  } else {
    fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"))// 写入文件
    return json
  }
}
