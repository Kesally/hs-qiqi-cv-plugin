import { segment } from "oicq";
import fetch from "node-fetch";
//项目路径
const _path = process.cwd();

export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '时间',
      /** 功能描述 */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 50000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "^#*几点了$",
          /** 执行方法 */
          fnc: 'time'
        },
      ]
    })
 }

async shijian(e) {

  let url = `http://api.tangdouz.com/time.php`;
  let response = await fetch(url);
  let res = await response.text();
  console.log(res);

  let msg = [
    segment.text(res),
  ];
//发送消息
  e.reply(msg);

  return true; //返回true 阻挡消息不再往下
}

}

