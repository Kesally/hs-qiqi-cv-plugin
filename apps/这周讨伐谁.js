export class Weekboss extends plugin {
  constructor() {
    super({
      name: "[枫叶]这周征讨哪三个呢",
      dsc: "随机返回三个周本boss",
      event: "message",
      priority: 4800,
      rule: [
        {
          reg: "^#这周讨伐谁$",
          fnc: "getThreeBoss"
        }
      ]
    })
  }

  /**
   * 获取三个周本boss
   * @param e
   */
  async getThreeBoss(e) {
    let bossName = [ "风魔龙", "北风王狼", "公子", "若陀龙王", "女士", "雷电将军", "散兵", "草龙", "仆人", "吞星之鲸" ]
    let randomNumber = Math.ceil(Math.random() * bossName.length - 1)
    let boss1 = bossName[randomNumber]
    bossName.splice(randomNumber, 1)
    randomNumber = Math.ceil(Math.random() * bossName.length - 1)
    let boss2 = bossName[randomNumber]
    bossName.splice(randomNumber, 1)
    randomNumber = Math.ceil(Math.random() * bossName.length - 1)
    let boss3 = bossName[randomNumber]
    bossName.splice(randomNumber, 1)
    await e.reply(`\n这周打 ${boss1}、${boss2} 和 ${boss3} 好不好~`, true, { at: true })
    return true
  }
}
