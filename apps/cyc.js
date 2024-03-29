import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import { promisify } from "util"
import { pipeline } from "stream"
import fetch from "node-fetch";
let mp3 = 10 //音频文件数量初始10个
let botsender = true
import { Config} from '../components/index.js'
if (!fs.existsSync(`plugins/hs-qiqi-plugin/resources/video/`)) {
  fs.mkdirSync(`plugins/hs-qiqi-plugin/resources/video/`);}
const chuo_path ='plugins/hs-qiqi-plugin/resources/戳一戳图片/'
let _path='./plugins/hs-qiqi-plugin/config/只听我的_群号.yaml'
let timeout = 20000//冷却
let r18 = false;//true开启绅士模式

await cyc ()
export class chuo extends plugin{
    constructor(){
    super({
        name: '[枫叶插件]戳一戳语音',
        dsc: '[枫叶插件]戳一戳语音',
        event: 'notice.group.poke',
        priority: -1,
        rule: [
            {
                /** 命令正则匹配 */
                fnc: 'cycyy'
                },
            ]
        }
    )
}
  async cycyy (e) {
    if(e.target_id == e.self_id){
      if(!Config.getConfig('set','pz')['cyc']){return false}
      let fy =  e.operator_id
    let now_time = new Date().getTime();
        let g = await redis.get("xs" + fy + ":g");
        g = parseInt(g);
        if (now_time < g + timeout) {
        let n = Math.round(Math.random() * 4)
        while(n<=0){n++;}
        if(n >= 3){
          await e.reply('戳累了看会视频吧')
          let url = `https://api.8uid.cn/yz.php?type=video`
          let response = await fetch(url);
          let ji = await response.arrayBuffer();
          fs.writeFile("plugins/hs-qiqi-plugin/resources/video/fycyc.mp4", Buffer.from(ji), "binary", function (err) {
            console.log(err || "保存成功");
            if (!err) {e.reply(segment.video(`plugins/hs-qiqi-plugin/resources/video/fycyc.mp4`));}});
        }else{
          await e.reply('戳累了看会视频吧')
          let url = `https://api.8uid.cn/jk.php?type=video`
          let response = await fetch(url);
          let ji = await response.arrayBuffer();
          fs.writeFile("plugins/hs-qiqi-plugin/resources/video/fycyc.mp4", Buffer.from(ji), "binary", function (err) {
            console.log(err || "保存成功");
            if (!err) {e.reply(segment.video(`plugins/hs-qiqi-plugin/resources/video/fycyc.mp4`));}});
            return;
        }}
        await redis.set("xs" + fy + ":g", now_time);
      logger.info('[枫叶]戳一戳语音')
     let file = fs.readdirSync(chuo_path)
     let num = Math.round(Math.random() * 40)
     let ma = parseInt(num);
     let imgnum = Math.round(Math.random() * (file.length - 1))
     while(imgnum <= 0){imgnum++;}
     let msg =  (segment.image('file://' + chuo_path + file[imgnum]))
     if(ma >= 35){
      await e.reply('给你几张壁纸别戳了')
      if(r18 == false){
        let url = 'https://sjtp.api.mofashi.ltd/api.php'
        let msgList = []
      const forwarder =
      botsender
        ? { nickname: Bot.nickname, user_id: Bot.uin }
        : {
          nickname: this.e.sender.card || this.e.user_id,
          user_id: this.e.user_id,
        };
      for(let i = 1; i <= 5; i++){
        msgList.push({
          message: segment.image(url),
          ...forwarder,
        });
      }
      await e.reply(await e.group.makeForwardMsg(msgList))
      return;
      }else{
        let url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=2`;
        const response = await fetch(url);
        let res = await response.json();
        let msgList = []
      const forwarder =
      botsender
        ? { nickname: Bot.nickname, user_id: Bot.uin }
        : {
          nickname: this.e.sender.card || this.e.user_id,
          user_id: this.e.user_id,
        };
      for(let i = 1; i <= 5; i++){
        msgList.push({
          message: segment.image(res.data[0].urls.original),
          ...forwarder,
        });
        await e.reply(await e.group.makeForwardMsg(msgList))
      return;
      }
     }}else if(ma >= 25){await e.reply(msg)}else if(ma >= 20){
      let kl = Math.round(Math.random() * mp3)
      while(kl <= 0){kl++;}
      let op =  (segment.record('plugins/hs-qiqi-plugin/resources/语音/'+ kl + '.mp3'))
      await e.reply(op)
        }else if(ma >= 15){
          await e.reply('你把我戳生气了')
          await e.group.muteMember(fy,60);
        }else if(ma >= 10){
     let url = `https://v2.alapi.cn/api/joke/random?token=A85G8uKBXqHs4PzA&num=1`;
	 //token会改变 变了请在插件issue区提出issues
     let response = await fetch(url);
     let res = await response.data();
     if(!res){
      e.reply('别戳了')
      return false
     }
     let ms = [
      segment.text(res)
     ];
     await e.reply(ms)
}else if(ma >= 5){
  e.reply('不准戳了')
  setTimeout(() => {
    e.group.pokeMember(e.operator_id)
  }, 1500);
}else{
  let wb =['喂(#`O′) 我干嘛！',

  '不要戳麻麻啦~', 

  '麻麻要被揉坏掉了',
  
  '你帮麻麻揉大了呢~',
  
  '你戳我干嘛？你喜欢我？',
  
  '再戳可就不礼貌了',
  
  '好气喔，我要给你起个难听的绰号',
  
  '滚啊，再戳就把你喂鱼']
  let i = Math.round(Math.random() * (wb.length - 1))
  e.reply(wb[i]);
}
}
}
}

async function cyc() {
     if (!fs.existsSync(chuo_path)) {
       fs.mkdirSync(chuo_path)
       try{
       let streamPipeline = promisify(pipeline)
       let picPath = `${chuo_path}/1.jpg`
       await streamPipeline(fs.createWriteStream(picPath))
       }catch(err) {}
} 
} 