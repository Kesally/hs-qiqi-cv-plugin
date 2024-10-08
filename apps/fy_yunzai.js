import User from "../../genshin/model/user.js"

let path = "./plugins/hs-qiqi-plugin/resources/记录帮助/"

export class fy_yunzai extends plugin {
  constructor(e) {
    super({
      name: "[枫叶插件]绑定功能",
      dsc: "",
      event: "message",
      priority: 10000,
      rule: [
        {
          reg: "^绑定$",
          fnc: "bd"
        },
        {
          reg: "^#枫叶记录帮助",
          fnc: "jlbz"
        }
      ]
    })
    this.User = new User(e)
  }

  async bd(e) {
    if (!e.isGroup) { return false }
    let 群名片 = `${this.e.member.card}`
    let uid = 群名片.match(/[1|2|5-9][0-9]{8}/g)
    if (!uid) {
      this.e.reply("群名片未含有正确的uid,你可以发送#绑定<+你的uid>")
      return
    }
    this.e.msg = "#绑定" + uid
    this.bingUid()
  }

  async bingUid() {
    await this.User.bingUid()
  }

  async jlbz(e) {
    let msg = "如果你绑定了stoken,可直接使用命令:更新抽卡记录"
    let msg1 = "如果你有6个月以上的记录文件，可直接发给机器人，云崽支持xlsx和json的记录文件"
    let msg2 = segment.image(`file://${path}6.jpg`)
    let msg3 = "没有的话，就只能自己手动从游戏里提取，游戏内只有6个月以内的记录"
    let msg4 = [ "安卓方法\n", segment.image(`${path}安卓.jpg`), "链接：https://wwm.lanzoul.com/yclink" ]
    let v = "'"
    let k = v + "https://img.qyinter.cn/dow.ps1" + v + ")"
    let msg5 = [ "pc端：powershell iex(irm " + k + "\n", segment.image(`${path}pc.jpg`), "\nPS：如果上面的不能用，下载下方工具，直接打开即可：https://img.qyinter.cn/gachalink.exe" ]
    let msg6 = [ "iOS方法\n", segment.image(`${path}ios.jpg`) ]

    let info = {
      nickname: Bot.nickname,
      user_id: Bot.uin
    }
    let forwardMsg = [
      {
        message: msg,
        nickname: Bot.nickname,
        user_id: Bot.uin
      }
    ]

    forwardMsg.push(
      {
        message: msg1,
        ...info
      }
    )
    forwardMsg.push(
      {
        message: msg2,
        ...info
      }
    )
    forwardMsg.push(
      {
        message: msg3,
        ...info
      }
    )
    forwardMsg.push(
      {
        message: msg4,
        ...info
      }
    )
    forwardMsg.push(
      {
        message: msg5,
        ...info
      }
    )
    forwardMsg.push(
      {
        message: msg6,
        ...info
      }
    )
    if (e.isGroup) {
      forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    }
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, "")
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, "___")
      .replace(/___+/, "<title color=\"#777777\" size=\"26\">＼（￣︶￣）／抽卡记录帮助</title>")
    // 发送消息
    e.reply(forwardMsg)
  }
}
