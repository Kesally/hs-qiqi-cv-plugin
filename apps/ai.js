import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import fetch from 'node-fetch'
import { Config} from '../components/index.js'

const _path = process.cwd();



export class ai extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '小爱ai',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 68888,
      rule: [
       {
          /** 命令正则匹配 */
          reg: '^ai回复概率(\\d)*(％|%)?$',
          /** 执行方法 */
          fnc: 'gailv',permission: 'master'//绝对主人限制
        },{
          /** 命令正则匹配 */
          reg: '^(开启|关闭)ai概率语音$',
          /** 执行方法 */
          fnc: 'gl',permission: 'master'//绝对主人限制
        },{
          /** 命令正则匹配 */
          reg: '^(开启|关闭)ai全局模式$',
          /** 执行方法 */
          fnc: 'qj',permission: 'master'//绝对主人限制
        },{
          /** 命令正则匹配 */
          reg: '',
          /** 执行方法 */
          fnc: 'xiaoai'
        }
      ]
    })
  }
 async gailv (e) {
 
	 if(e.msg.includes('ai回复概率')){
		let gailv = e.msg.replace(/ai回复概率|%|％/g,'').trim();
		 gailv = Number(gailv)
		 if(gailv > 100){
			 e.reply('最高100~')
			 return
		 }
		  if(gailv < 0){
			 e.reply('不可以低于0!')
			 return
		 }
         await  redis.set('aigailv:ai', gailv)
		await e.reply(`ai回复概率成功设置为${gailv}%`)
		 
	 }
	 
	 
 }
 async qj(e) {
 
 if(e.msg.includes('开启')){
       await  redis.set('aiqj:ai', '1')
       await  e.reply('已开启ai全局模式~')
      } else if(e.msg.includes('关闭')){
       await  redis.set('aiqj:ai', '0')
        await  e.reply('已关闭ai全局模式~')
      }
      return true
}
  async gl (e) {
 
 if(e.msg.includes('开启')){
       await  redis.set('aiyy:ai', '1')
       await  e.reply('已开启ai概率回复语音~')
      } else if(e.msg.includes('关闭')){
       await  redis.set('aiyy:ai', '0')
        await  e.reply('已关闭ai概率回复语音~')
      }
      return true
}
  async xiaoai (e) {
    //判断概率
  let gailv = await  redis.get('aigailv:ai')
  let sz = Math.ceil(Math.random()* 100)
   if(!gailv){gailv=100}
   if(gailv<sz||gailv==0){return false}
 //过滤信息
if (!e.msg || e.msg.charAt(0) == '#') {
		    return  false
		     }
//过滤文字
if(e.msg.includes('疫情')){
       return false
      }
 //过滤100以内的数字，避免与小飞的点歌序号起冲突
 if(/^([0-9]|[0-9][0-9])$/.test(this.e.msg)){
		return false
		}
//避免 群友引用回复机器人发的图片 触发ai回复
	if(e.source){
	if (/^\[图片]$/.test(e.source.message)) {
    return 
 }}
 //判断全局
 let name =Config.getConfig('set','mz')['botname']
 let qj =await redis.get('aiqj:ai')
	  if(!qj || qj==0){ 
     if(e.isPrivate||e.msg.includes(name) ||(e.atBot && e.msg)){
       answer(e)
   	 return true
   	 }else{return false}
    }else if(qj==1){
       answer(e)
   	 return true
       }
       
    }
}

async function answer(e) {
    let num = Math.ceil(Math.random()* 4)
    let name =Config.getConfig('set','mz')['botname']
    e.msg=e.msg.replace(`${name}`, "小爱")
    let res = await(await fetch(`https://xiaobai.klizi.cn/API/other/xiaoai.php?data=&msg=${e.msg}`)).json()
    //判断是否关闭语音
    let yy =await redis.get('aiyy:ai')
    let qd=1
    if(!yy|| yy==0){
    qd =2
    }
    if(res)	{
        let msg = res.text.replace(/菲菲|小思|小爱/g,name).replace(/小爱/g, name).replace(/小米/g, '').replace(/对不起，暂不支持该功能，你和我聊点儿别的吧/g,`${name}听不明白(⇀‸↼‶)`)
        if(qd == 1&&num==1){
          msg = res.mp3
          e.reply(segment.record(msg))
          return true
        }else{
        e.reply(msg)
        }
       }	
       
}