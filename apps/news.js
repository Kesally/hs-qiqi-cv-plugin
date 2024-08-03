export class example extends plugin {
  constructor() {
    super({
      name: "[枫叶]今日新闻",
      dsc: "每日60s读懂世界",
      event: "message",
      priority: 3399,
      rule: [
        {
          reg: "^#?(今日新闻|每日60[Ss秒])$",
          fnc: "news"
        }
      ]
    })
  }

  async news(e) {
    let url = "https://api.jun.la/60s.php?format=image"

    return e.reply(segment.image(url), true)
  }
}
