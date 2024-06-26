export class example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: "[枫叶]今日新闻",
      /** 功能描述 */
      dsc: "简单开发示例",
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
  // e.msg 用户的命令消息
    console.log("用户命令：", e.msg)

    // 执行的逻辑功能
    let url = "https://api.qqsuu.cn/api/dm-60s"
    let msg = [
      segment.at(e.user_id),
      segment.image(url)
    ]
    // 发送消息
    e.reply(msg)

    return true // 返回true 阻挡消息不再往下
  }
}
