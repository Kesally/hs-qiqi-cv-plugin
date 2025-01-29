import fetch from "node-fetch";

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
          fnc: "news",
        },
      ],
    });
  }

  async fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async news(e) {
    let url = "https://api.03c3.cn/api/zb";

    try {
      let response = await this.fetchWithTimeout(url);
      if (!response.ok) throw new Error(`HTTP 状态码: ${response.status}`);

      return e.reply(segment.image(url), true);
    } catch (error) {
      console.error("API请求失败：", error);
      return e.reply("今日新闻API请求失败，请稍后再试。");
    }
  }
}
