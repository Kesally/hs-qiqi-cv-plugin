import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import { Config} from '../components/index.js'

let GayCD = {};
let ks=0

export class szzd extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '数字炸弹',
      /** 功能描述 */
      dsc: '简单开发示例',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1,
      rule: [
		{
		  reg: '^#?数字炸弹$',
		  fnc: 'NumberBoom'
		},
		{
		  reg: '^#?数字炸弹中级$',
		  fnc: 'NumberBoomzj'
		},
		{
		  reg: '^#?数字炸弹高级$',
		  fnc: 'NumberBoomgj'
		},
		{
		  reg: '^#?数字炸弹地狱$',
		  fnc: 'NumberBoomdy'
		},
		{
		  reg: '^#?数字炸弹炼狱$',
		  fnc: 'NumberBoomly'
		},
		{
		  reg: '^(\\d)*$',
		  fnc: 'NumberBoomAnser'
		},
		{
		  reg: '^结束数字炸弹$',
		  fnc: 'NumberBoomEnd'
		},{
		  reg: '^(关闭|开启)数字炸弹(涩涩|色色|sese)$',
		  fnc: 'guanb',
		  permission: 'master'
		},
      ]
    })
  }
async guanb(e) {
   if(e.msg.includes('开启')) {
await redis.set('shuzizadan','1')
await e.reply('已开启数字炸弹涩涩')
   }else if(e.msg.includes('关闭')){
await redis.set('shuzizadan','0')
await e.reply('已关闭数字炸弹涩涩') 
   }
}
async NumberBoomly(e) {
	if(!Config.getConfig('set','pz')['szzd']) return this.reply('数字炸弹功能已关闭')
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      e.reply('数字炸弹正在进行哦!')
      return false
    }

    let num = Math.ceil(Math.random() * 10000000000)

    console.log(num)

    e.reply("从1-10000000000中猜一个数字吧！", true,{recallMsg:30})

    guessConfig.gameing = true
    guessConfig.current = num

    guessConfig.timer = setTimeout(() => {
      if (guessConfig.gameing) {
        guessConfig.gameing = false
        e.reply(`数字炸弹结束，很遗憾并没有人猜中噢！正确答案是${num}`)
        return true
      }
    }, 60000 * 48) //时间二十四分钟

    return true
  }
  async NumberBoomzj(e) {
	  if(!Config.getConfig('set','pz')['szzd']) return this.reply('数字炸弹功能已关闭')
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      e.reply('数字炸弹正在进行哦!')
      return false
    }

    let num = Math.ceil(Math.random() * 10000)

    console.log(num)

    e.reply("从1-10000中猜一个数字吧！", true,{recallMsg:20})

    guessConfig.gameing = true
    guessConfig.current = num

    guessConfig.timer = setTimeout(() => {
      if (guessConfig.gameing) {
        guessConfig.gameing = false
        e.reply(`数字炸弹结束，很遗憾并没有人猜中噢！正确答案是${num}`)
        return true
      }
    }, 60000 * 6) //时间一分钟

    return true
  }
  async NumberBoomdy(e) {
	  if(!Config.getConfig('set','pz')['szzd']) return this.reply('数字炸弹功能已关闭')
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      e.reply('数字炸弹正在进行哦!')
      return false
    }
  
    let num = Math.ceil(Math.random() * 100000000)
  
    console.log(num)
  
    e.reply("从1-100000000中猜一个数字吧！", true,{recallMsg:30})
  
    guessConfig.gameing = true
    guessConfig.current = num
  
    guessConfig.timer = setTimeout(() => {
      if (guessConfig.gameing) {
        guessConfig.gameing = false
        e.reply(`数字炸弹结束，很遗憾并没有人猜中噢！正确答案是${num}`)
        return true
      }
    }, 60000 * 24) //时间12分钟
  
    return true
  }
  async NumberBoomgj(e) {
	  if(!Config.getConfig('set','pz')['szzd']) return this.reply('数字炸弹功能已关闭')
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      e.reply('数字炸弹正在进行哦!')
      return false
    }
  
    let num = Math.ceil(Math.random() * 1000000)
  
    console.log(num)
  
    e.reply("从1-1000000中猜一个数字吧！", true,{recallMsg:30})
  
    guessConfig.gameing = true
    guessConfig.current = num
  
    guessConfig.timer = setTimeout(() => {
      if (guessConfig.gameing) {
        guessConfig.gameing = false
        e.reply(`数字炸弹结束，很遗憾并没有人猜中噢！正确答案是${num}`)
        return true
      }
    }, 60000 * 12) //时间一分钟
  
    return true
  }
  async NumberBoom(e) {
	  if(!Config.getConfig('set','pz')['szzd']) return this.reply('数字炸弹功能已关闭')
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      e.reply('数字炸弹正在进行哦!')
      return false
    }
  
    let num = Math.ceil(Math.random() * 100)
  
    console.log(num)
  
    e.reply("从1-100中猜一个数字吧！", true,{recallMsg:15})
  
    guessConfig.gameing = true
    guessConfig.current = num
  
    guessConfig.timer = setTimeout(() => {
      if (guessConfig.gameing) {
        guessConfig.gameing = false
        e.reply(`数字炸弹结束，很遗憾并没有人猜中噢！正确答案是${num}`)
        return true
      }
    }, 60000 *2) //时间一分钟
  
    return true
  }

  async NumberBoomAnser(e) {
    let guessConfig = getGuessConfig(e)
    let { gameing, current } = guessConfig
    if (!gameing) return false
    if (current > e.msg) {
     e.reply('你这数字小了！再猜一个吧', true,{recallMsg:15})
    }else if (current < e.msg) {
    e.reply('你这数字大了！再猜一个吧', true,{recallMsg:15})
    } else{
     let pd = await redis.get('shuzizadan')
     let msg={}
     if(!pd||pd==1){
	 msg = ['你猜对了，给你张涩图吧。快谢谢我！', segment.image('https://api.sdgou.cc/api/tao/')]
     }else if(pd==0){
     msg = '你猜对了哟，你真厉害！O(∩_∩)O~'
     }
	  e.reply(msg,true)
      guessConfig.gameing = false
      clearTimeout(guessConfig.timer)
	}
    return true
  }

  async NumberBoomEnd(e) {
    let guessConfig = getGuessConfig(e)
    if (!guessConfig.gameing) return false
    guessConfig.gameing = false
    clearTimeout(guessConfig.timer)
    e.reply('数字炸弹结束成功')
    return true
  }
}

const guessConfigMap = new Map()

function getGuessConfig(e) {
  let key = e.message_type + e[e.isGroup ? 'group_id' : 'user_id'];
  let config = guessConfigMap.get(key);
  if (config == null) {
    config = {
      gameing: false,
      current: '',
      timer: null,
    }
    guessConfigMap.set(key, config);
  }
  return config;
}