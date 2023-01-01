import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import { Config} from '../components/index.js'
import moment from 'moment';
let sum = 1; //这里记录总次数 也就是每天可查询次数接口分开算
// yyyy-MM-DD 默认当前年月日 改后面的时间就行
let dateTime='YYYY-MM-DD 00:00:00'; //这里定义时间刷新时间格式是 年-月-日 时:分:秒
let GayCD = {};


export class sjs extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '随机类游戏',
      /** 功能描述 */
      dsc: '随机类游戏',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^今日运气$',
          /** 执行方法 */
          fnc: 'jryq'
        },
        {
          /** 命令正则匹配 */
          reg: '^#*开奖$',
          /** 执行方法 */
          fnc: 'cj'
        },
        {
          /** 命令正则匹配 */
          reg: "^群友(老婆|老公)|娶老婆|娶老公$",
          /** 执行方法 */
          fnc: "whoismywife",
        },
        {
          /** 命令正则匹配 */
          reg: "^娶群主$",
          /** 执行方法 */
          fnc: "qunzhu",
        }
      ]
    })
  }

  async cj(e) {
	  if(!Config.getConfig('set','pz')['jryq']) return this.reply('抽奖功能已关闭')
    if(e.isMaster){e.reply('你是主人没有CD')}
    else{
	  let qq =  e.user_id
    let now_time = new Date().getTime();
        let g = await redis.get("xs" + qq + ":g");
        g = parseInt(g);
        let transferTimeout = 60000
        if (now_time < g + transferTimeout) {
        e.reply(`每${transferTimeout / 1000 / 60}分钟游玩一次`);
        //存在CD。直接返回
        return;
        }
        await redis.set("xs" + qq + ":g", now_time);
      }
      let qq =  e.user_id
    for(let msg of e.message){
     
       if(msg.type =='at'){
           qq = msg.qq
           break
     }
    }
    
    if(qq == null){
        return true
    }
    
    var num = Math.random();
  num = Math.ceil(num * 10);
 var nums = num*0.10
 var numss = num + nums
 
 
 
 
 var num2 = Math.random();
  num2 = Math.ceil(num2 * 12);
  var numb =num2*0.08
  var numbb =num2+numb
   
  var num3 = Math.random();
   num3 = Math.ceil(num3 * 14);
  
  var num4 = Math.random();
   num4 = Math.ceil(num4 * 12.9);

if(numss > numbb){
	await e.reply("正在开奖中.....");
	
	 setTimeout(() => {
	  e.reply("摇号成功，一秒后开奖");
	},500);
 let msg = ['恭喜抽中三等奖,送你一个哥哥', segment.image('http://25252.xyz/j/index.php')]
   e.reply(msg);
}else if(numss < num3){
	await e.reply("正在开奖中.....");

	 setTimeout(() => {
	  e.reply("摇号成功，一秒后开奖");
	},500);
 let msk = ['恭喜抽中二等奖,送你一张壁纸', segment.image('https://mirlkoi.ifast3.vipnps.vip/api.php?sort=top')]
 e.reply(msk);
 }else if(num3 < num4){
	 await e.reply("正在开奖中.....");
	 
	  setTimeout(() => {
	   e.reply("摇号成功，一秒后开奖");
	 },500);
	let msp = ['恭喜抽中特等奖晚安', segment.image('https://iw233.cn/API/Random.php')]
e.reply(msp);
	e.group.muteMember(qq,28800);
}else if(num4 < numbb){
	await e.reply("正在开奖中.....");
	
	 setTimeout(() => {
	  e.reply("摇号成功，一秒后开奖");
	},500);
	let msk = ['恭喜抽中一等奖,涩图一张', segment.image('https://api.sdgou.cc/api/tao/')]
	e.reply(msk);
}
  return true; //返回true 阻挡消息不再往下
  }

  async jryq (e) {
if(!Config.getConfig('set','pz')['jryq']) return this.reply('今日运气功能已关闭')
var wow = Math.random();
wow = Math.ceil(wow * 50);
var num = Math.random();
num = Math.ceil(num * 100);
var wm = wow + num;
  let data_redis = await redis.get(`fy-plugin:${e.user_id}_jryq`); 
	var new_sum = 1;
	if (data_redis) {
		if (JSON.parse(data_redis)[0].num == sum) {
			e.reply(`你今天已经获取过运气了请明天再来~`)
			return;
		}
		new_sum += JSON.parse(data_redis)[0].num; //次数累加
	}
	 
 console.log(num);
 if(num >=0 && num < 50){
     
let msg =[
  segment.at(e.user_id), 
  `\n今日你的运气为`+num+`点,不要灰心,相信自己,明天会变得更差！`,
]

e.reply(msg);



}else if(num > 50 && num < 80){
    let msg =[
  segment.at(e.user_id), 
  `\n今日你的运气为`+num+`点,人品还行噢,可以安全出门啦！`, segment.image('https://mirlkoi.ifast3.vipnps.vip/api.php?sort=top'),
]

e.reply(msg);


}else if(num > 80 && num<= 99){
     let msg =[
  segment.at(e.user_id), 
  `\n今日你的运气为`+num+`点,建议去买彩票噢！`, segment.image('https://mirlkoi.ifast3.vipnps.vip/api.php?sort=top'),
]

e.reply(msg);


}else{
   let msg =[
  segment.at(e.user_id), 
  `\n今日你的运气为`+num+`点,你今天就是天选之人！！`, segment.image('https://mirlkoi.ifast3.vipnps.vip/api.php?sort=top'),
]

e.reply(msg);

}
   
   	var time = moment(Date.now()).add('days', 1).format(dateTime)
	var new_date = (new Date(time).getTime() - new Date().getTime()) / 1000 //获取隔天凌晨四点的时间差
	console.log(new_date)
	let redis_data = [{
		num: new_sum, //次数
	}]
	 console.log(redis_data)
	redis.set(`fy-plugin:${e.user_id}_jryq`, JSON.stringify(redis_data), { //写入缓存
		EX: parseInt(new_date)
	});
   
    return true;
  }
  async whoismywife(e) {
    if(!e.isGroup){return e.reply('emmm...你确定你在群里？')}
    if(!Config.getConfig('set','pz')['jryq']) return this.reply('群友老婆/老公已关闭')
      if (!e.isMaster) {
        if (GayCD[e.user_id]) {
          e.reply("该命令有2分钟cd");
          return true;
        }
  
        GayCD[e.user_id] = true;
  
        GayCD[e.user_id] = setTimeout(() => {
          if (GayCD[e.user_id]) {
            delete GayCD[e.user_id];
          }
        }, 120000);
      }
      let sexc;
      let sex_mode;
      if (/老婆/.test(e.msg)) {
        sexc = "female"
        sex_mode = "老婆"
      }else{
        sexc = "male"
        sex_mode = "老公"
      }
  
      //获取群员列表
      let mmap = await e.group.getMemberMap();
      //转换数组
      let arrMember = Array.from(mmap.values());
      //随机获得一个群员对象
      let randomWife = arrMember[Math.round(Math.random() * (arrMember.length - 1))];

      let nowtime = new Date().getTime() / 1000 - 2592000
  
      let Wifetime = randomWife.last_sent_time
      while (true) {
        if (randomWife.sex == sexc && Wifetime >= nowtime) {
          break;
        } /*else if(mmap != sexc){
         await e.reply(`你群里没有${sex_mode}`);
         return true;
         }*/else {
          randomWife = arrMember[Math.round(Math.random() * (arrMember.length - 1))];
          Wifetime = randomWife.last_sent_time
        }
      }
      //获取信息及转换
      let lasttime = formatDate(Wifetime)
  
      let sexobj = {
        'female': "女",
        'male': "男",
        'unknown': "人妖"
      }

      //回复的信息
      let msg = [
        segment.at(e.user_id),
        `\n今天你的群友${sex_mode}是`,
        segment.image(
          `https://q1.qlogo.cn/g?b=qq&s=0&nk=${randomWife.user_id}`
        ),
        `【${randomWife.nickname}】 (${randomWife.user_id}) ${sexobj[randomWife.sex]} 哒哒哒！\n`,
        `最后发言时间：${lasttime}`
      ];
  
      //判断是否为超管
      if (e.isMaster) {
        msg[1] = `\n主人大大，今天您的${sex_mode}是`,
          await e.reply(msg);
        return true;
      }
  
      if (Math.random() > 0.5) {
        await e.reply(msg);
      } else {
        await e.reply(`醒醒,你根本没有${sex_mode}`);
      }
      return true;
    }
  
    //娶群主
    async qunzhu(e) {
    if(!e.isGroup){return e.reply('emmm...你确定你在群里？')}
  if(!Config.getConfig('set','pz')['jryq']) return this.reply('该功能被关闭了')
      let randomWife = e.group.pickMember(e.group.info.owner_id)
      let k=Math.random()
    if(e.isMaster){
      let msg = [
          segment.at(e.user_id),
          "\n主人大大,成功带走了群主",
          segment.image(
            `https://q1.qlogo.cn/g?b=qq&s=0&nk=${randomWife.user_id}`
          ),
          `【群主】 (${randomWife.user_id}) 汪汪汪~`,
        ];
       await e.reply(msg);
      }else  if( k> 0.5) {
      let msg = [
          segment.at(e.user_id),
          "\n成功娶到群主",
          segment.image(
            `https://q1.qlogo.cn/g?b=qq&s=0&nk=${randomWife.user_id}`
          ),
          `【群主】 (${randomWife.user_id}) 哒哒哒！`,
        ];
        await e.reply(msg);
      } else if(k<0.2){
        await e.reply('醒醒,你根本娶不到群主!!!');
      }else{
      await e.reply('可惜,差一点就娶到群主啦~');
      }
  
      return true;
    }
  }
  
  /**时间转换 */
  function formatDate(time) {
    var now = new Date(parseFloat(time) * 1000);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (date >= 0 && date <= 9) {
      date = "0" + date;
    }
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (hour >= 1 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minute >= 0 && minute <= 9) {
      minute = "0" + minute;
    }
    if (second >= 0 && second <= 9) {
      second = "0" + second;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  }
  