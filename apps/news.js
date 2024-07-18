export class example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: "[枫叶]今日新闻",
      /** 功能描述 */
      dsc: "每日60s读懂世界",
      event: "message",
      /** 优先级，数字越小等级越高 */
      priority: 3399,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "^#?今日新闻.*$",
          /** 执行方法 */
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
