import { Config} from '../components/index.js'
import plugin from '../../../lib/plugins/plugin.js' 
import moment from 'moment';
import { segment } from 'oicq'
import schedule from 'node-schedule'

if(Config.getConfig('set','mz')['botname']==null){
  logger.info('【枫叶插件】检测到未设置机器人名字')
  logger.info(' 请发送：枫叶设置，查看名字')
}

let za_num =await redis.get('yz:zaoan_num')

if(!za_num){
  await redis.set('yz:zaoan_num','0')
  logger.info('【枫叶插件】初始化早安排行')
}

let wa_num =await redis.get('yz:wanan_num')

if(!wa_num){
 await redis.set('yz:wanan_num','0')
 logger.info('【枫叶插件】初始化晚安排行')
}

//let rule =`秒 分 时 * * ?` 
let za_rule =`0 59 5 * * ?`
schedule.scheduleJob(za_rule, () => {
    console.log('【枫叶插件】清空早安排名');
     redis.set('yz:zaoan_num','0')
})

let wa_rule =`0 59 17 * * ?`
schedule.scheduleJob(wa_rule, () => {
    console.log('【枫叶插件】清空晚安排名');
     redis.set('yz:wanan_num','0')
})

const _path = process.cwd();
let path = `${_path}/plugins/hs-qiqi-plugin/resources/可莉语音/早安.mp3`

//初次接触云崽时写的，写的很乱，虽然现在可以简化，但舍不得，毕竟全是旧回忆(就是写的时间过了太久了,嘿嘿~)

//你的机器人名字
//let botname='小可莉'

//【是true】【否false】仅支持触发方式为1.群聊提到机器人名字 2.@机器人 3.私聊
//let bothujiao = false

//【晚安】回复的【前缀】,全文是：msg1+'现在是'+xx时间+'起床的时候记得叫我哟~'，请自己在下面改
let msgwa =['晚安啦，祝你好梦，','晚安伙伴，','晚安，']

//【新用户(指从未没说过晚安的人)首次】在0-10点说【早安】的问候语
let msgza = ['早安啦，今天又是元气满满的一天哟~','早安，今天也要开心哟~']

//0-5点59分59说 早安
let taizaole=['太早了，再睡会儿吧','没到6点呢，起床也要卷？']

//10-15点说【早安】的回复
let shidaoshiwu=['太阳都晒屁股啦，你才起床？你真懒!','起床起得也太晚了吧！']

//15-24点说【早安】的回复
let shiwudaoershisi=['这个时间点就别早安了吧','就当我听错了吧，你过得不是中国时间吧？']

//8-12点说【晚安】的回复
let badaoshisan=['你不会通宵了吧，注意身体呀！','这时候才睡觉吗？昨天晚上干嘛去了？']

//12-14点说【晚安】的回复
let shierdaoshisi=['你是要睡午觉么，午安啦','这时候是中午呀，你要睡觉吗，午安啦']

//14-18点说【晚安】的回复
let shisidaoshiba=['这也睡得太早了，天色还早呢','哎~睡觉也这么卷么？']



export class zaowan extends plugin {
  constructor () {
    super({
      name: '枫叶睡眠时间',
      dsc: '睡眠',
      event: 'message',
      priority: 10000,
      rule: [
        {
          reg: '^(早安|早上好|早上好呀|早上好吖)$',//命令匹配
          fnc: 'zaoan'
        },
        {
          reg: '^(晚安|晚安啦|睡觉了|睡觉去了)$',//匹配
          fnc: 'wanan'
        },{
        reg: '^我是?第几个?(睡觉|晚安)的?(？)?$',//命令匹配
        fnc: 'shuijiao_ph'
        },
        {
        reg: '^我是?第几个?(起床|早安)的?(？)?$',//匹配
        fnc: 'qichuang_ph'
        }
      ]
    })
  }

  async wanan (e) {    
/*    if (e.msg.includes(botname) || e.atBot && e.msg || e.isPrivate) {
    }
  else{

      if(bothujiao)
      {return true}
      
  }*/
      if(!Config.getConfig('set','pz')['smsj']){ return false}
      let botname = Config.getConfig('set','mz')['botname']
      let msg1=msgwa[Math.ceil(Math.random() * msgwa['length'])-1]
      let b = new Date().getTime();//当前时间戳
      let nn = moment(b).format('已'+'HH')
      let nnn=nn.replace('已0','').replace('已','')//小时
      let 晚安缓存分钟 = moment(b).format('点'+'mm')
      晚安缓存分钟=晚安缓存分钟.replace('点0','').replace('点','')//分钟
      if(nnn>7&&nnn<12){
        let jj=badaoshisan[Math.ceil(Math.random() * badaoshisan['length'])-1]
        e.reply('已经'+nnn+'点了,'+jj);
        return true
      }
      if(nnn>11&&nnn<14){
        let ww=shierdaoshisi[Math.ceil(Math.random() * shierdaoshisi['length'])-1]
        e.reply('现在是'+nnn+'点,'+ww);
        return true
      }
      if(nnn>13&&nnn<18){
        let ll=shisidaoshiba[Math.ceil(Math.random() * shisidaoshiba['length'])-1]
        e.reply('现在是'+nnn+'点,'+ll);
        return true
      }
      
      let bb = moment(b).format('是'+'HH'+'点'+'mm'+'分'+'ss'+'秒')//当前时间

      let o =await JSON.parse( await redis.get(`Yunzai:hahaha:wandata_${e.user_id}`))
      //那些只知道发早安的人是不是油饼
      if(o){
        let oo = moment(o.date).format('在'+'HH'+'点'+'mm'+'分'+'ss'+'秒')
        await e.reply('你'+oo.replace(/在0/g,'在').replace(/点0/g,'点').replace(/00秒/g,'')+'的时候，都发过晚安了，竟然还不睡觉?')
        return true
      }

      await redis.INCR('yz:wanan_num')//累加
      wa_num = await redis.get('yz:wanan_num')

      e.reply(msg1+'现在'
                  +bb.replace(/是0/g,'是').replace(/点0/g,'点').replace(/00秒/g,'')
                  +'，起床的时候记得叫'+botname+'哟~'+`\n你是第${wa_num}个睡觉的٩(๑>◡<๑)۶ `,true)//晚安回复的全文，请在这里改
        //用最直接的方法去掉没有用的字，嘿嘿，下面嫌麻烦就全部cv了


      //存档写入数据  
      let wandata = {
        //qq: e.user_id,
        wa_num: wa_num,
        date: b
      }

      //计算到18点的时间差，获取缓存时间
      let 晚安缓存={}
      if(nnn<24&&nnn>17){
       晚安缓存=24-nnn+18-1
      }else{
       晚安缓存=18-nnn-1
      }
     晚安缓存分钟=60-晚安缓存分钟-1//多减1，避免多的秒数产生bug

       //记录下用户数据，不然大家通用时间就搞笑了
    await redis.set(`Yunzai:hahaha:wandata_${e.user_id}`, JSON.stringify(wandata), { //写入缓存值

        EX: parseInt(晚安缓存*60*60+晚安缓存分钟*60) //秒数不管了 在17点59分查睡觉排名的人不管了！
      
    })
      
    return true; // 返回true 阻挡消息不再往下
  }



  async zaoan (e) {
/*    if (e.msg.includes(botname) || e.atBot && e.msg || e.isPrivate) {
      }
    else{
  
        if(bothujiao){return true}
        
    }*/
    if(!Config.getConfig('set','pz')['smsj']){ return false}
    let botname = Config.getConfig('set','mz')['botname']
    
    let msg2=msgza[Math.ceil(Math.random() * msgza['length'])-1]

    let a = new Date().getTime()//当前时间戳
    let v = moment(a).format('都'+'HH')
    let vv= v.replace('都0','').replace('都','')//小时
    let 早安缓存分钟=moment(a).format('点'+'mm')
    早安缓存分钟=早安缓存分钟.replace('点0','').replace('点','')//分钟
    if(vv>9&&vv<15){
      let mm=shidaoshiwu[Math.ceil(Math.random() * shidaoshiwu['length'])-1]
      e.reply('都'+vv+'点了,'+mm);
      return true
    }
    if(vv>14&&vv<24){
      let pp=shiwudaoershisi[Math.ceil(Math.random() * shiwudaoershisi['length'])-1]
      e.reply('现在是'+vv+'点,'+pp)
      return true
    }
    if(vv<6){
        let tt=taizaole[Math.ceil(Math.random() * taizaole['length'])-1]
        e.reply('现在是'+vv+'点,'+tt)
        return true
      }

    let wandata = await JSON.parse(await redis.get(`Yunzai:hahaha:wandata_${e.user_id}`))//晚安存档数据

    let y1 = await JSON.parse(await redis.get(`Yunzai:hahaha:zaodata_${e.user_id}`));//之前的早安数据

   if(y1){  
    let y = y1.date
    let m = moment(y).format('在'+'HH'+'点'+'mm'+'分'+'ss'+'秒')

    //那些只知道发早安的人是不是油饼
  e.reply('你已经'+m.replace(/在0/g,'在').replace(/点0/g,'点').replace(/00秒/g,'')
  +'的时候，发过早安了哟~'+botname+'可是记得很清楚的！多大的人了还赖床？')
  return true//阻止往下
  }

  await redis.INCR('yz:zaoan_num')//累加
  za_num = await redis.get('yz:zaoan_num')

  if(!wandata){  
  let sjs = Math.random()   
  if(sjs < 0.66){
    e.reply(msg2+`\n你今天是第${za_num}个起床的(〃'▽'〃)`,true)
      }else{
    await e.reply(segment.record(`file:///${path}`))  
    await e.reply(`你今天是第${za_num}个起床的(〃'▽'〃)`,true)
      }    
    }

    if(wandata){
    let f =wandata.date 
    let c = a-f-28800000 //获取毫秒(且换算成北京时间)
    let ca =moment(c).format('HH'+'小时'+'mm'+'分钟'+'ss'+'秒')//转下格式
    let cc ='是'+ca
    let c1=(a-f)/1000   //获取秒

    //8至24小时，多了24小时就不管了，估计人没了
    if(c1==28800 || c1>28800 && c1<86400){
    e.reply('早安,你的睡眠时间'
              +cc.replace(/00小时00分钟0/g,'').replace(/00小时00分钟/g,'').replace(/00小时0/g,'').replace(/00小时/g,'').replace(/是0/g,'是').replace(/00分钟/g,'').replace(/00秒/g,'').replace(/时0/g,'时').replace(/钟0/g,'钟')
              +'哟~，'+botname+'就知道你今天会睡得很好(*^▽^*)'+`\n你今天是第${za_num}个起床的(〃'▽'〃)`,true
    )
    //用最直接的方法去掉没有用的字，嘿嘿，下面嫌麻烦就全部cv了
    }
    //才10分钟，他在搞颜色吧？
    if(c1<600 || c1==600){
    e.reply('呵呵,你真的有在睡觉吗?你的睡眠时间可是只有'
              +cc.replace(/是00小时00分钟0/g,'').replace(/是00小时00分钟/g,'').replace(/是00小时0/g,'').replace(/是00小时/g,'').replace(/是0/g,'').replace(/00分钟/g,'').replace(/00秒/g,'').replace(/时0/g,'时').replace(/钟0/g,'钟')
              +'哟~'+`\n你今天是第${za_num}个起床的(〃'▽'〃)`,true           
          );
    }
    //10分钟到半个小时
    if(c1>600 && c1<1800 || c1==1800 ){
      e.reply('啊这！就睡这么点时间吗？你的睡眠时间'
              +cc.replace(/00小时00分钟0/g,'').replace(/00小时00分钟/g,'').replace(/00小时0/g,'').replace(/00小时/g,'').replace(/是0/g,'是').replace(/00分钟/g,'').replace(/00秒/g,'').replace(/时0/g,'时').replace(/钟0/g,'钟')
              +'，'+botname+'提醒你,你的睡眠时间严重不足，多睡一会儿吧！'+`\n你今天是第${za_num}个起床的(〃'▽'〃)`,true           
            );
      }
    //半个小时到5个小时
      if(c1>1800 && c1<18000 || c1==18000){
        e.reply('早安，你的睡眠时间'
              +cc.replace(/00小时00分钟0/g,'').replace(/00小时00分钟/g,'').replace(/00小时0/g,'').replace(/00小时/g,'').replace(/是0/g,'是').replace(/00分钟/g,'').replace(/00秒/g,'').replace(/时0/g,'时').replace(/钟0/g,'钟')
              +'，'+botname+'提醒你，学习或者工作固然很重要，但还是要爱护自己身体哟~'+`\n你今天是第${za_num}个起床的(〃'▽'〃)`,true           
              );
        }
    //5个小时到8个小时
    if(c1>18000 && c1<28800 ){
      e.reply('早安，你的睡眠时间'
              +cc.replace(/00小时00分钟0/g,'').replace(/00小时00分钟/g,'').replace(/00小时0/g,'').replace(/00小时/g,'').replace(/是0/g,'是').replace(/00分钟/g,'').replace(/00秒/g,'').replace(/时0/g,'时').replace(/钟0/g,'钟')
              +'，'+botname+'提醒你，你的睡眠时间没有达到8小时，要多注意休息哟~'+`\n你今天是第${za_num}个起床的(〃'▽'〃)`,true           
            );
      }
  }
  let zaodata = {
    //qq: e.user_id,
    za_num: za_num,
    date: a
  }

 let 早安缓存小时=24-vv+6-1
  早安缓存分钟=60-早安缓存分钟-1

  //记录下用户数据
  redis.set(`Yunzai:hahaha:zaodata_${e.user_id}`, JSON.stringify(zaodata), { //写入缓存值
    EX: parseInt( 早安缓存小时*60*60+早安缓存分钟* 60)//秒数与晚安缓存同理忽略掉
  });
return true 

}

async shuijiao_ph(e){
   let botname = Config.getConfig('set','mz')['botname']
   let sj = await JSON.parse(await redis.get(`Yunzai:hahaha:wandata_${e.user_id}`));
   if(sj){
    e.reply(`你是第${sj.wa_num}个睡觉的(*^▽^*) `,true)
   }else{
    e.reply(`你没有发过晚安，${botname}这里没有你的数据`,true)
   }
   return true
}
async qichuang_ph(e){
    let botname = Config.getConfig('set','mz')['botname']
    let qc = await JSON.parse(await redis.get(`Yunzai:hahaha:zaodata_${e.user_id}`));
    if(qc){
     e.reply(`你是第${qc.za_num}个起床的(≖ᴗ≖)✧`,true)
    }else{
     e.reply(`你没有发过早安，${botname}这里没有你的数据`,true)
    }
    return true
 }
}
