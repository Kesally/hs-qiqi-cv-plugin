import fetch from "node-fetch";

let group = true;

export class qndxx extends plugin {
  constructor() {
    super({
      name: "青年大学习",
      dsc: "截图",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#?(青年大学习|大学习|青年)$",
          fnc: "qndxx",
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

  async qndxx(e) {
    if (!group && e.isPrivate && !e.isMaster) {
      return true;
    }

    let url = "https://quickso.cn/api/qndxx/api.php?sort=random";
    try {
      let response = await this.fetchWithTimeout(url);
      if (!response.ok) throw new Error(`HTTP 状态码: ${response.status}`);
      
      let res = await response.text();
      res = res.replace(/<\/br>/g, "").trim();
      
      e.reply(segment.image("https://" + res));
    } catch (error) {
      console.error("API请求失败：", error);
      e.reply("青年大学习API请求失败，请稍后再试。");
    }
    
    return true;
  }
}
