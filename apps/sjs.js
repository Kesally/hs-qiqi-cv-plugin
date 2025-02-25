import Yaml from "../model/Yaml.js"
import { Config } from "../components/index.js"
import moment from "moment"
import common from "../../../lib/common/common.js"
import fs from "node:fs"
import { promisify } from "util"
import { pipeline } from "stream"

let sum = 1 // 这里记录总次数 也就是每天可查询次数接口分开算
let dateTime = "YYYY-MM-DD 00:00:00" // 这里定义时间刷新时间格式是 年-月-日 时:分:秒
let GayCD = {}
const xhz_path = "plugins/hs-qiqi-plugin/resources/小黑子图片/"
await tp()
let path = "./plugins/hs-qiqi-plugin/config/配置/开奖配置.yaml"

export class sjs extends plugin {
  constructor() {
    super({
      name: "随机类游戏",
      dsc: "随机类游戏",
      event: "message",
      priority: 1,
      rule: [
        {
          reg: "^开奖帮助$",
          fnc: "bz"
        },
        {
          reg: "^开奖(一|二|三|特)等奖(开启|关闭)撤回$",
          fnc: "kq"
        },
        {
          reg: "^开奖禁言时间(\\d)+(秒)?$",
          fnc: "jy"
        },
        {
          reg: "^开奖冷却时间(\\d)+(秒)?$",
          fnc: "kj"
        },
        {
          reg: "^开奖撤回时间(\\d)+(秒)?$",
          fnc: "ch"
        },
        {
          reg: "^今日运气$",
          fnc: "jryq"
        },
        {
          reg: "^#*开奖$",
          fnc: "cj"
        },
        {
          reg: "^群友(老婆|老公)|娶老婆|娶老公$",
          fnc: "whoismywife"
        },
        {
          reg: "^娶群主$",
          fnc: "qunzhu"
        }
      ]
    })
  }

  async kq(e) {
    if (!Config.getConfig("set", "pz").jryq) return this.reply("抽奖功能已关闭")
    if (!e.isMaster) { e.reply("你不是主人走开"); return true }
    if (e.isMaster && e.msg.includes("开奖一等奖开启撤回")) {
      let data = await Yaml.getread(path)
      data.开奖一等奖 = 1
      await Yaml.getwrite(path, data)
      return e.reply("开奖一等奖开启撤回成功", true)
    }
    if (e.isMaster && e.msg.includes("开奖一等奖关闭撤回")) {
      let data = await Yaml.getread(path)
      data.开奖一等奖 = 2
      await Yaml.getwrite(path, data)
      return e.reply("开奖一等奖关闭撤回成功", true)
    } if (e.isMaster && e.msg.includes("开奖二等奖开启撤回")) {
      let data = await Yaml.getread(path)
      data.开奖二等奖 = 1
      await Yaml.getwrite(path, data)
      return e.reply("开奖二等奖开启撤回成功", true)
    } if (e.isMaster && e.msg.includes("开奖二等奖关闭撤回")) {
      let data = await Yaml.getread(path)
      data.开奖二等奖 = 2
      await Yaml.getwrite(path, data)
      return e.reply("开奖二等奖关闭撤回成功", true)
    } if (e.isMaster && e.msg.includes("开奖三等奖开启撤回")) {
      let data = await Yaml.getread(path)
      data.开奖三等奖 = 1
      await Yaml.getwrite(path, data)
      return e.reply("开奖三等奖开启撤回成功", true)
    } if (e.isMaster && e.msg.includes("开奖三等奖关闭撤回")) {
      let data = await Yaml.getread(path)
      data.开奖三等奖 = 2
      await Yaml.getwrite(path, data)
      return e.reply("开奖三等奖关闭撤回成功", true)
    } if (e.isMaster && e.msg.includes("开奖特等奖开启撤回")) {
      let data = await Yaml.getread(path)
      data.开奖特等奖 = 1
      await Yaml.getwrite(path, data)
      return e.reply("开奖特等奖开启撤回成功", true)
    } if (e.isMaster && e.msg.includes("开奖特等奖关闭撤回")) {
      let data = await Yaml.getread(path)
      data.开奖特等奖 = 2
      await Yaml.getwrite(path, data)
      return e.reply("开奖特等奖关闭撤回成功", true)
    }
    return false
  }

  async bz(e) {
    if (!Config.getConfig("set", "pz").jryq) return this.reply("抽奖功能已关闭")
    if (!e.isMaster) { e.reply("你不是主人走开"); return true }
    let data = await Yaml.getread(path)
    let lq = data.开奖冷却
    lq = lq / 1000
    let ee = data.开奖撤回
    ee = ee / 1000
    let wjy = data.开奖禁言
    wjy = wjy * 1
    let yi = data.开奖一等奖
    let er = data.开奖二等奖
    let san = data.开奖三等奖
    let te = data.开奖特等奖
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
        message: "=====枫叶开奖配置====="
      }
    ]
    let msg = []
    let ui = []
    let pp = []
    let se = []
    let st = []
    let sy = []
    let su = []
    if (yi == 1) {
      se.push("开奖一等奖是否撤回:是")
    } else if (yi == 2) {
      se.push("开奖一等奖是否撤回:否")
    }
    if (er == 1) {
      st.push("开奖二等奖是否撤回:是")
    } else if (er == 2) {
      st.push("开奖二等奖是否撤回:否")
    }
    if (san == 1) {
      sy.push("开奖三等奖是否撤回:是")
    } else if (san == 2) {
      sy.push("开奖三等奖是否撤回:否")
    }
    if (te == 1) {
      su.push("开奖特等奖是否撤回:是")
    } else if (te == 2) {
      su.push("开奖特等奖是否撤回:否")
    }
    msg.push(`当前枫叶开奖撤回时间为${ee}秒\n可发送开奖撤回时间()秒来调整`)
    ui.push(`当前枫叶开奖冷却时间为${lq}秒\n可发送开奖冷却时间()秒来调整`)
    pp.push(`当前枫叶开奖禁言时间为${wjy}秒\n可发送开奖禁言时间()秒来调整`)
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
    forwardMsg.push(
      {
        ...userInfo,
        message: pp
      }
    )
    forwardMsg.push(
      {
        ...userInfo,
        message: se
      }
    )
    forwardMsg.push(
      {
        ...userInfo,
        message: st
      }
    )
    forwardMsg.push(
      {
        ...userInfo,
        message: sy
      }
    )
    forwardMsg.push(
      {
        ...userInfo,
        message: su
      }
    )
    forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    await e.reply(forwardMsg)
  }

  async jy(e) {
    if (!Config.getConfig("set", "pz").jryq) return this.reply("抽奖功能已关闭")
    if (!e.isMaster) { e.reply("你不是主人走开"); return true }
    let data = await Yaml.getread(path)
    let chtime = e.msg.replace(/开奖禁言时间|秒/g, "")
    let 禁言时间 = chtime
    chtime = chtime * 1
    data.开奖禁言 = chtime
    await Yaml.getwrite(path, data)
    return e.reply(`开奖禁言时间,成功设置为${禁言时间}秒`)
  }

  async ch(e) {
    if (!Config.getConfig("set", "pz").jryq) return this.reply("抽奖功能已关闭")
    if (!e.isMaster) { e.reply("你不是主人走开"); return true }
    let data = await Yaml.getread(path)
    let chtime = e.msg.replace(/开奖撤回时间|秒/g, "")
    let 撤回时间 = chtime
    chtime = chtime * 1000
    data.开奖撤回 = chtime
    await Yaml.getwrite(path, data)
    return e.reply(`开奖撤回时间,成功设置为${撤回时间}秒`)
  }

  async kj(e) {
    if (!Config.getConfig("set", "pz").jryq) return this.reply("抽奖功能已关闭")
    if (!e.isMaster) { e.reply("你不是主人走开"); return true }
    let data = await Yaml.getread(path)
    let chtime = e.msg.replace(/开奖冷却时间|秒/g, "")
    let 冷却时间 = chtime
    chtime = chtime * 1000
    data.开奖冷却 = chtime
    await Yaml.getwrite(path, data)
    return e.reply(`开奖冷却时间,成功设置为${冷却时间}秒`)
  }

  async cj(e) {
    if (!Config.getConfig("set", "pz").jryq) return this.reply("抽奖功能已关闭")
    let data = await Yaml.getread(path)
    let lq = data.开奖冷却
    lq = lq * 1
    let ee = data.开奖撤回
    ee = ee * 1
    let wjy = data.开奖禁言
    wjy = wjy * 1
    let yi = data.开奖一等奖
    let er = data.开奖二等奖
    let san = data.开奖三等奖
    let te = data.开奖特等奖
    if (!e.isMaster) {
      let qq = e.user_id
      let now_time = new Date().getTime()
      let g = await redis.get("xs" + qq + ":g")
      g = parseInt(g)
      let transferTimeout = lq
      if (now_time < g + transferTimeout) {
        e.reply(`每${transferTimeout / 1000}秒游玩一次`)
        // 存在CD。直接返回
        return
      }
      await redis.set("xs" + qq + ":g", now_time)
    }
    let qq = e.user_id
    for (let msg of e.message) {
      if (msg.type == "at") {
        qq = msg.qq
        break
      }
    }

    if (qq == null) {
      return true
    }

    let num = Math.random()
    num = Math.ceil(num * 10)
    let nums = num * 0.10
    let numss = num + nums

    let num2 = Math.random()
    num2 = Math.ceil(num2 * 12)
    let numb = num2 * 0.08
    let numbb = num2 + numb

    let num3 = Math.random()
    num3 = Math.ceil(num3 * 14)

    let num4 = Math.random()
    num4 = Math.ceil(num4 * 12.9)

    if (!Config.getConfig("set", "pz").dz) { return false }
    let file = fs.readdirSync(xhz_path)
    let imgnum = Math.round(Math.random() * (file.length - 1))

    if (numss > numbb) {
      let y = await e.reply("正在开奖中.....")
      let msg = [ segment.at(e.user_id), "恭喜抽中三等奖,送你一个哥哥", segment.image("file://" + xhz_path + file[imgnum]) ]
      let yy = await e.reply(msg)
      if (san == 1) {
        await common.sleep(ee)
        e.group.recallMsg(yy.message_id)
        e.group.recallMsg(y.message_id)
      } else {
        await e.reply(yy)
      }
    } else if (numss < num3) {
      let y = await e.reply("正在开奖中.....")
      let msk = [ segment.at(e.user_id), "恭喜抽中二等奖,送你一张壁纸", segment.image("https://t.mwm.moe/ycy") ]
      // 替换接口：https://t.lizi.moe/pc 替换接口2：https://moe.jitsu.top/img
      let i = await e.reply(msk)
      if (er == 1) {
        await common.sleep(ee)
        e.group.recallMsg(i.message_id)
        e.group.recallMsg(y.message_id)
      } else {
        await e.reply(i)
      }
    } else if (num3 < num4) {
      let yy = await e.reply("正在开奖中.....")
      let msp = [ segment.at(e.user_id), "恭喜抽中特等奖晚安", segment.image("https://moe.anosu.top/img") ]
      // 替换接口1：https://pic.tianyi.one 替换接口2：https://moe.jitsu.top/api
      let oo = await e.reply(msp)
      if (te == 1) {
        await common.sleep(ee)
        e.group.recallMsg(oo.message_id)
        e.group.recallMsg(yy.message_id)
      } else {
        await e.reply(oo)
      }
      e.group.muteMember(qq, wjy)
    } else if (num4 < numbb) {
      let yy = await e.reply("正在开奖中.....")
      let msk = [ segment.at(e.user_id), "恭喜抽中一等奖,涩图一张", segment.image("https://api.sdgou.cc/api/tao/") ]
      // 替换接口1：https://api.anosu.top/img 替换接口2：https://api.anosu.top/img
      let uu = await e.reply(msk)
      if (yi == 1) {
        await common.sleep(ee)
        e.group.recallMsg(uu.message_id)
        e.group.recallMsg(yy.message_id)
      } else {
        await e.reply(uu)
      }
    }
    return true // 返回true 阻挡消息不再往下
  }

  async jryq(e) {
    if (!Config.getConfig("set", "pz").jryq) return this.reply("今日运气功能已关闭")
    let num = Math.random()
    num = Math.ceil(num * 100)
    let data_redis = await redis.get(`fy-plugin:${e.user_id}_jryq`)
    let new_sum = 1
    if (data_redis) {
      if (JSON.parse(data_redis)[0].num == sum) {
        e.reply("你今天已经获取过运气了请明天再来~")
        return
      }
      new_sum += JSON.parse(data_redis)[0].num // 次数累加
    }

    console.log(num)
    if (num >= 0 && num < 50) {
      let msg = [
        segment.at(e.user_id),
        "\n今日你的运气为" + num + "点,不要灰心,相信自己,明天会变得更差！"
      ]

      e.reply(msg)
    } else if (num > 50 && num < 80) {
      let msg = [
        segment.at(e.user_id),
        "\n今日你的运气为" + num + "点,人品还行噢,可以安全出门啦！", segment.image("https://t.mwm.moe/ysmp")
        // 替换接口1:https://mahiro.tianyi.one  
      ]

      e.reply(msg)
    } else if (num > 80 && num <= 99) {
      let msg = [
        segment.at(e.user_id),
        "\n今日你的运气为" + num + "点,建议去买彩票噢！", segment.image("https://moe.anosu.top/img")
        // 替换接口1：http://www.98qy.com/sjbz/api.php
      ]

      e.reply(msg)
    } else {
      let msg = [
        segment.at(e.user_id),
        "\n今日你的运气为" + num + "点,你今天就是天选之人！！", segment.image("https://moe.anosu.top/img")
        // 替换接口1：https://api.ghser.com/random/api.php 替换接口2：https://api.ghser.com/random/pc.php
      ]

      e.reply(msg)
    }

    let time = moment(Date.now()).add("days", 1).format(dateTime)
    let new_date = (new Date(time).getTime() - new Date().getTime()) / 1000 // 获取隔天凌晨四点的时间差
    console.log(new_date)
    let redis_data = [
      {
        num: new_sum // 次数
      }
    ]
    console.log(redis_data)
    redis.set(`fy-plugin:${e.user_id}_jryq`, JSON.stringify(redis_data), { // 写入缓存
      EX: parseInt(new_date)
    })

    return true
  }

  async whoismywife(e) {
    if (!e.isGroup) { return e.reply("emmm...你确定你在群里？") }
    if (!Config.getConfig("set", "pz").jryq) return this.reply("群友老婆/老公已关闭")
    if (!e.isMaster) {
      if (GayCD[e.user_id]) {
        e.reply("该命令有2分钟cd")
        return true
      }

      GayCD[e.user_id] = true

      GayCD[e.user_id] = setTimeout(() => {
        if (GayCD[e.user_id]) {
          delete GayCD[e.user_id]
        }
      }, 120000)
    }
    let sexc
    let sex_mode
    if (/老婆/.test(e.msg)) {
      sexc = "female"
      sex_mode = "老婆"
    } else {
      sexc = "male"
      sex_mode = "老公"
    }

    // 获取群员列表
    let mmap = await e.group.getMemberMap()
    // 转换数组
    let arrMember = Array.from(mmap.values())
    // 随机获得一个群员对象
    let randomWife = arrMember[Math.round(Math.random() * (arrMember.length - 1))]

    let nowtime = new Date().getTime() / 1000 - 2592000

    let Wifetime = randomWife.last_sent_time
    while (true) {
      if (randomWife.sex == sexc && Wifetime >= nowtime) {
        break
      } else {
        randomWife = arrMember[Math.round(Math.random() * (arrMember.length - 1))]
        Wifetime = randomWife.last_sent_time
      }
    }
    // 获取信息及转换
    let lasttime = formatDate(Wifetime)

    let sexobj = {
      "female": "女",
      "male": "男",
      "unknown": "人妖"
    }

    // 回复的信息
    let msg = [
      segment.at(e.user_id),
      `\n今天你的群友${sex_mode}是`,
      segment.image(
        `https://q1.qlogo.cn/g?b=qq&s=0&nk=${randomWife.user_id}`
      ),
      `【${randomWife.nickname}】 (${randomWife.user_id}) ${sexobj[randomWife.sex]} 哒哒哒！\n`,
      `最后发言时间：${lasttime}`
    ]

    // 判断是否为超管
    if (e.isMaster) {
      msg[1] = `\n主人大大，今天您的${sex_mode}是`
      await e.reply(msg)
      return true
    }

    if (Math.random() > 0.5) {
      await e.reply(msg)
    } else {
      await e.reply(`醒醒,你根本没有${sex_mode}`)
    }
    return true
  }

  // 娶群主
  async qunzhu(e) {
    if (!e.isGroup) { return e.reply("emmm...你确定你在群里？") }
    if (!Config.getConfig("set", "pz").jryq) return this.reply("该功能被关闭了")
    let randomWife = e.group.pickMember(e.group.info.owner_id)
    let k = Math.random()
    if (e.isMaster) {
      let msg = [
        segment.at(e.user_id),
        "\n主人大大,成功带走了群主",
        segment.image(
          `https://q1.qlogo.cn/g?b=qq&s=0&nk=${randomWife.user_id}`
        ),
        `【群主】 (${randomWife.user_id}) 汪汪汪~`
      ]
      await e.reply(msg)
    } else if (k > 0.5) {
      let msg = [
        segment.at(e.user_id),
        "\n成功娶到群主",
        segment.image(
          `https://q1.qlogo.cn/g?b=qq&s=0&nk=${randomWife.user_id}`
        ),
        `【群主】 (${randomWife.user_id}) 哒哒哒！`
      ]
      await e.reply(msg)
    } else if (k < 0.2) {
      await e.reply("醒醒,你根本娶不到群主!!!")
    } else {
      await e.reply("可惜,差一点就娶到群主啦~")
    }

    return true
  }
}

/**
 * 时间转换
 * @param time
 */
function formatDate(time) {
  let now = new Date(parseFloat(time) * 1000)
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  if (month >= 1 && month <= 9) {
    month = "0" + month
  }
  if (date >= 0 && date <= 9) {
    date = "0" + date
  }
  let hour = now.getHours()
  let minute = now.getMinutes()
  let second = now.getSeconds()
  if (hour >= 1 && hour <= 9) {
    hour = "0" + hour
  }
  if (minute >= 0 && minute <= 9) {
    minute = "0" + minute
  }
  if (second >= 0 && second <= 9) {
    second = "0" + second
  }
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
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
