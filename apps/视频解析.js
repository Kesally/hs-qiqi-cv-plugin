import fetch from "node-fetch"
import { Config } from "../components/index.js"

export class fy_ship extends plugin {
  constructor() {
    super({
      name: "【枫叶插件】检测视频链接",
      dsc: "",
      event: "message",
      priority: -1,
      rule: [
        {
          reg: "^https://m.v.qq.com/(.*)/(.*)$",
          fnc: "tx"
        }, {
          reg: "^拼接(https|http)://(.*)$",
          fnc: "pinjie"
        }
      ]
    })
  }

  async tx(e) {
    let url = e.msg
    let data = await (await fetch(`https://xian.txma.cn/API/jx_txjx.php?url=${url}`)).json()
    let k = data.url
    let name = data.title
    if (k && name) {
      e.reply(name + "\n" + k)
      let forward = await this.makeForwardMsg(url)
      e.reply(forward)
    } else {
      e.reply("解析腾讯视频失败~\n去浏览器使用拼接接口吧...")
      let forward = await this.makeForwardMsg(url)
      e.reply(forward)
    }
  }

  async pinjie(e) {
    let url = e.msg.replace(/拼接/g, "")
    let forward = await this.makeForwardMsg(url)
    e.reply(forward)
  }

  async makeForwardMsg(keys) {
    let 机器人名字 = Config.getConfig("set", "mz").botname
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
        message: `[-------Bot：${机器人名字}-------]\n\n拼接路线,请复制链接后去浏览器打开，QQ会屏蔽链接\n\n建议使用浏览器去官网获取视频链接，最好是https的，尽量不要使用手机视频app分享出来的链接，目前测试爱奇艺等等不使用浏览器去官方获取视频链接，就很难解析，腾讯视频倒是没啥影响`
      }
    ]
    let msg = [ `[线路1]\n\n\nhttp://hhhhhhhhhhh.cn:99/?url=${keys}` ]
    forwardMsg.push(
      {
        ...userInfo,
        message: msg
      }
    )
    if (this.e.isGroup) {
      forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, "")
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, "___")
      .replace(/___+/, "<title color=\"#777777\" size=\"26\">拼接url链接,请复制链接后去浏览器打开，QQ会屏蔽链接</title>")
    return forwardMsg
  }
}
