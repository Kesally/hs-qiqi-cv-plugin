import fs from "node:fs"
import { promisify } from "util"
import { pipeline } from "stream"
import fetch from "node-fetch"
import { Config } from "../components/index.js"

let mp3 = 10 // 音频文件数量初始10个
let botsender = true

const videoPath = "plugins/hs-qiqi-plugin/resources/video/"
const chuoPath = "plugins/hs-qiqi-plugin/resources/戳一戳图片/"
let timeout = 20000 // 冷却时间
let r18 = false // true开启绅士模式

if (!fs.existsSync(videoPath)) {
  fs.mkdirSync(videoPath)
}

await cyc()

export class chuo extends plugin {
  constructor() {
    super({
      name: "[枫叶插件]戳一戳语音",
      dsc: "[枫叶插件]戳一戳语音",
      event: "notice.group.poke",
      priority: -1,
      rule: [ { fnc: "cycyy" } ]
    })
  }

  async cycyy(e) {
    if (e.target_id !== e.self_id) return

    if (!Config.getConfig("set", "pz").cyc) return false

    let fy = e.operator_id
    let now_time = new Date().getTime()
    let g = await redis.get("xs" + fy + ":g")
    g = parseInt(g)

    if (now_time < g + timeout) {
      let n = Math.round(Math.random() * 4) + 1
      await this.handleVideoReply(e, n)
      return
    }

    await redis.set("xs" + fy + ":g", now_time)
    logger.info("[枫叶]戳一戳语音")

    let file = fs.readdirSync(chuoPath)
    let imgnum = Math.round(Math.random() * (file.length - 1)) + 1
    let msg = segment.image("file://" + chuoPath + file[imgnum])

    let ma = Math.round(Math.random() * 40)
    await this.handleReply(e, ma, msg, fy)
  }

  async handleVideoReply(e, n) {
    await e.reply("戳累了看会视频吧")
    let url = n >= 3 ? "http://api.yujn.cn/api/zzxjj.php?type=video" : "http://api.yujn.cn/api/xjj.php?type=video"
    let response = await fetch(url)
    let ji = await response.arrayBuffer()
    fs.writeFile(`${videoPath}/fycyc.mp4`, Buffer.from(ji), "binary", function(err) {
      console.log(err || "保存成功")
      if (!err) {
        e.reply(segment.video(`${videoPath}/fycyc.mp4`))
      }
    })
  }

  async handleReply(e, ma, msg, fy) {
    if (ma >= 35) {
      await e.reply("给你几张壁纸别戳了")
      await this.sendWallpapers(e)
    } else if (ma >= 25) {
      await e.reply(msg)
    } else if (ma >= 20) {
      let kl = Math.round(Math.random() * mp3) + 1
      let op = segment.record(`plugins/hs-qiqi-plugin/resources/语音/${kl}.mp3`)
      await e.reply(op)
    } else if (ma >= 15) {
      await e.reply("你把我戳生气了")
      await e.group.muteMember(fy, 60)
    } else if (ma >= 10) {
      await this.sendJoke(e)
    } else if (ma >= 5) {
      e.reply("不准戳了")
      setTimeout(() => {
        e.group.pokeMember(e.operator_id)
      }, 1500)
    } else {
      await this.sendRandomMessage(e)
    }
  }

  async sendWallpapers(e) {
    if (r18 == false) {
      let url = "https://sjtp.api.mofashi.ltd/api.php"
      let msgList = this.createForwardMessage(e, url, 5)
      await e.reply(await e.group.makeForwardMsg(msgList))
    } else {
      let url = "https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=2"
      const response = await fetch(url)
      let res = await response.json()
      let msgList = this.createForwardMessage(e, res.data[0].urls.original, 5)
      await e.reply(await e.group.makeForwardMsg(msgList))
    }
  }

  createForwardMessage(e, url, count) {
    let msgList = []
    const forwarder = botsender ? { nickname: Bot.nickname, user_id: Bot.uin } : { nickname: e.sender.card || e.user_id, user_id: e.user_id }
    for (let i = 1; i <= count; i++) {
      msgList.push({ message: segment.image(url), ...forwarder })
    }
    return msgList
  }

  async sendJoke(e) {
    let url = "https://v2.alapi.cn/api/joke/random?token=A85G8uKBXqHs4PzA&num=1"
    const response = await fetch(url)
    let res = await response.json()
    let data = res?.data?.content
    if (!data) {
      e.reply("别戳了")
      return
    }
    await e.reply(data)
  }

  async sendRandomMessage(e) {
    let wb = [
      "喂(#`O′) 我干嘛！",
      "不要戳麻麻啦~",
      "麻麻要被揉坏掉了",
      "你帮麻麻揉大了呢~",
      "你戳我干嘛？你喜欢我？",
      "再戳可就不礼貌了",
      "好气喔，我要给你起个难听的绰号",
      "滚啊，再戳就把你喂鱼"
    ]
    let i = Math.round(Math.random() * (wb.length - 1))
    e.reply(wb[i])
  }
}

async function cyc() {
  if (!fs.existsSync(chuoPath)) {
    fs.mkdirSync(chuoPath)
    try {
      let streamPipeline = promisify(pipeline)
      let picPath = `${chuoPath}/1.jpg`
      await streamPipeline(fs.createWriteStream(picPath))
    } catch (err) {
      console.error(err)
    }
  }
}
