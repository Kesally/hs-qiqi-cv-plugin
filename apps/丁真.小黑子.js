import { segment } from "oicq";//导包部分
import fetch from "node-fetch";
import { Config} from '../components/index.js'

export class example extends plugin {
    constructor () {
      super({
        /** 功能名称 */
        name: '一眼丁真',
        /** 功能描述 */
        dsc: '每日一张丁真图片或坤坤图片',
        /** https://oicqjs.github.io/oicq/#events */
        event: 'message',
        /** 优先级，数字越小等级越高 */
        priority: 4888,
        rule: [
          {
            /** 命令正则匹配 */
            reg: '^((.*)鸡你太美(.*)|(.*)坤坤(.*)|(.*)小黑子(.*)|(.*)鲲鲲(.*)|(.*)鸽鸽(.*))$',
            /** 执行方法 */
            fnc: 'jntm'
          },
          {
                /** 命令正则匹配 */
                reg: '^((.*)一眼丁真(.*)|(.*)雪豹闭嘴(.*)|(.*)芝士雪豹(.*)|(.*)雪豹(.*)|(.*)讨口子(.*))$',
                /** 执行方法 */
                fnc: 'dz'
          },{
                 reg: "^丁真帮助",
                 fnc: 'dzbz'
            }
            
        ]
    })
}

async dzbz () {
     if(!Config.getConfig('set','pz')['dz']) return this.reply('一眼丁真功能已关闭')
	 this.reply('发送一眼丁真.雪豹闭嘴.芝士雪豹.讨口子.鸡你太美.坤坤.小黑子.鲲鲲.鸽鸽.触发表情,全文匹配')
  }
async jntm(e) {
	if(!Config.getConfig('set','pz')['dz']) {return false}
  let timeout = 0; //0表示不撤回，单位毫秒
  let url = `http://25252.xyz/j/index.php`;
  let msg=[segment.at(e.user_id),	  
	  segment.image(url)]
    let msgRes = await e.reply(msg);
    if (timeout!=0 && msgRes && msgRes.message_id){
      let target = null;
      if (e.isGroup) {
        target = e.group;
      }else{
        target = e.friend;
      }
      if (target != null){
        setTimeout(() => {
          target.recallMsg(msgRes.message_id);
          target.recallMsg(e.message_id);
        }, timeout);
      }
    } 
    return true; //返回true 阻挡消息不再往下
}

async dz(e) {
	if(!Config.getConfig('set','pz')['dz']) {return false} 
    let timeout = 0; //0表示不撤回，单位毫秒
    let url = await(await fetch('https://api.micrsky.com/dzimgs')).json();
    let msg=[segment.at(e.user_id),	  
        segment.image(url)]
      let msgRes = await e.reply(msg);
      if (timeout!=0 && msgRes && msgRes.message_id){
        let target = null;
        if (e.isGroup) {
          target = e.group;
        }else{
          target = e.friend;
        }
        if (target != null){
          setTimeout(() => {
            target.recallMsg(msgRes.message_id);
            target.recallMsg(e.message_id);
          }, timeout);
        }
      } 
      return true; //返回true 阻挡消息不再往下
  }
 }
 