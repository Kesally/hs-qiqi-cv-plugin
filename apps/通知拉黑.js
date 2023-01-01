
//拉黑词不同于群屏蔽词，原文中若只是带有拉黑词并不会提醒，如果对方说的话与拉黑词一致，或者是@群友说了拉黑词，又或者是说了拉黑词且带有你机器人名字，那么机器人会通知你要不要拉黑









let path = "./config/config/other.yaml"
let l=0
let kk=0
let eee={}
import { Config} from '../components/index.js'
import plugin from '../../../lib/plugins/plugin.js'
import fs from 'fs'
import cfg from '../../../lib/config/config.js'
import YAML from 'yaml'
import { segment } from 'oicq'
import common from '../../../lib/common/common.js'
import lodash from 'lodash'



export class hslistener extends plugin {
  constructor (){
    super({
      name: '拉黑词监听',
      dsc: '监听拉黑词',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 4988
      ,
      rule: [ {
        reg: '',
        /** 执行方法 */
        fnc: 'hslistener'
      },/*{
        reg: '#名字',
        fnc: 'cs'
    },*/{
        reg: '^#*取消拉黑词(.)+',
        /** 执行方法 */
        fnc: 'dellh'
      }, {
        reg: '^#*创建拉黑词(.)*',
        /** 执行方法 */
        fnc: 'addlh'
      }, {
        reg: '^#*拉黑词列表$',
        fnc: 'lahlb'
      }, {
        reg: '^#*直接拉黑$',
        fnc: 'lahei'
      }, {
        reg: '^#*拉黑(qq|QQ)(.*)$',
        fnc: 'lhQQ'
      },
      {
        reg: '^#*拉黑词帮助$',
        fnc: 'laheibz',
        permission: 'master'
      },{
        reg: '^#*取消拉黑(QQ|qq)(.*)$',
        fnc: 'quxiao'
      },{
        reg: '^#*拉黑名单$',
        fnc: 'laheimd'
      }]
    })

    this._path = process.cwd().replace(/\\/g, '/')
    this.wordResPath = `${this._path}/plugins/hs-qiqi-plugin/resources/拉黑词`
  }
    async init (path = `${this.wordResPath}/`) {
    if (!fs.existsSync(path)) { fs.mkdirSync(path) }
  }
   

/*async cs (){
let botname = Config.getConfig('set','pz')['botname']
this.reply(`${botname}`)
}*/
  async lahlb () {
  if(!Config.getConfig('set','pz')['laheici']){
  return this.reply('拉黑词功能已关闭')
  }
    let words = []
    let files = []
    let forWordMsg = []
    let globalPath = `${this.wordResPath}/`
    // 获取
    words = []
      files = fs.readdirSync(globalPath).filter((file) => file.endsWith('.yaml'))
      for (let file of files) { words = lodash.unionWith(YAML.parse(fs.readFileSync(`${globalPath}/${file}`, 'utf8')), words) }
    forWordMsg.push({
      message: `拉黑词如下\n[只有主人才能管理]\n共 ${words.length} 个`,
      nickname: Bot.nickname,
      user_id: Bot.uin
    })
    for (let i = 0; i < words.length; i += 100) {
      let message = []
      for (let j = i; j < i + 100 && j < words.length; j++) {
        message.push(`${j + 1}、【${words[j]}】`)
        if (j !== i + 99) message.push('\n')
      }
      forWordMsg.push({
        message,
        nickname: Bot.nickname,
        user_id: Bot.uin
      })
      if (i > 500) {
        let ellipsisWords = words.length - i
        forWordMsg.push({
          message: `拉黑词较多，剩下的${ellipsisWords}个词语已经省略`,
          nickname: Bot.nickname,
          user_id: Bot.uin
        })
        break
      }
    }
       if(this.e.isPrivate){
          let sed = await this.e.friend.makeForwardMsg(forWordMsg)
     await this.reply(sed, false, 100)
        }
   
        
    if(this.e.isGroup){
    let sed = await this.e.group.makeForwardMsg(forWordMsg)
     await this.reply(sed, false, 100)
  }
}
  async hslistener () {
   if(!Config.getConfig('set','pz')['laheici']) {return false}
    if (this.e.isMaster) { return false }
    let receivedMsg = ''
    for (let val of this.e.message) {
      switch (val.type) {
        case 'text':
          receivedMsg = receivedMsg + val.text
          break
        default:
          break
      }
    }
    if (receivedMsg !== '') {
      let DelReg = /#*取消拉黑词|#*创建拉黑词/g
      if (DelReg.test(this.e.msg)) { return false }
      let wordlist = await this.getBlackWords()
      try {
        for (let word of wordlist) {
          let receivedMsg1=receivedMsg.replaceAll(/#|，|,| /g, '')
          if(this.e.isPrivate){
               eee = '私聊' 
          }else if(this.e.isGroup){
             eee = '群'+this.e.group_id+this.e.group_name
          }
          let  msg1 = [
            segment.image(`https://q1.qlogo.cn/g?b=qq&s=100&nk=${this.e.user_id}`),
            `检测到拉黑词：${word}\n`,
            `来源是：${eee}\n`,
            `这个人的QQ：${this.e.user_id}\n`,
            `这个人的昵称：${this.e.nickname}\n`,
            '已将这个人的QQ标记成最新待拉黑QQ\n发送：直接拉黑，可直接拉黑它'
        ]
        let botname = Config.getConfig('set','mz')['botname']
          if (receivedMsg1==word || receivedMsg1==botname+word ||receivedMsg1==word+botname)
           {      
            await common.relpyPrivate(cfg.masterQQ[0], msg1)
            kk=this.e.user_id
            l=1
            logger.info(`检测到拉黑词：${word}`)
            this.islog = true
          }
        }
      } catch (e) {}
    }
    return false
  
  }
  
  // 检查权限
  async CheckAuth () {
  return (this.e.isMaster)
  }
  
  // 获得
  async getBlackWords () {
    let words = []
    let globalPath = `${this.wordResPath}/`
    let groupPath = `${this.wordResPath}/${this.e.group_id}`
    // 
    await this.init(`${globalPath}/`)
    let files = fs.readdirSync(globalPath).filter((file) => file.endsWith('.yaml'))
    for (let file of files) { words = lodash.unionWith(YAML.parse(fs.readFileSync(`${globalPath}/${file}`, 'utf8')), words) }
    return words
  }
async dellh () {
if(!Config.getConfig('set','pz')['laheici']) {return this.reply('拉黑词功能已关闭')}
    if (!await this.CheckAuth()) { return true }
    let handleSentence = this.e.msg.replaceAll(/#*取消拉黑词|#*创建拉黑词/g, '').trim()
    if (!handleSentence) { return false }
    let handleWords = handleSentence.replaceAll('，', ',').split(',')
    let indexWords = []
    let existWord = []
    let folderPath = `${this.wordResPath}/`
    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith('.yaml'))

    for (let handleWord of handleWords) {
      for (let file of files) {
        let wordlist = YAML.parse(fs.readFileSync(`${folderPath}/${file}`, 'utf8'))
        if (wordlist.includes(handleWord)) {
          indexWords.push(handleWord)
          wordlist = lodash.remove(wordlist, (thisWord) => thisWord !== handleWord)
          if (!wordlist) {
            fs.unlinkSync(`${folderPath}/${file}`)
            continue
          }
          fs.writeFileSync(`${folderPath}/${file}`, YAML.stringify(wordlist, null, '\t'))
        }
      }
    }
    existWord = lodash.difference(handleWords, indexWords)
    let reMsg = ''
    if (indexWords.length) {
      reMsg = reMsg + `取消了拉黑词：【${indexWords.join('】【')}】${(existWord.length) ? '\n' : ''}`
    }
    if (existWord.length) {
      reMsg = reMsg + `没有拉黑词：【${existWord.join('】【')}】`
    }
    this.reply(reMsg, true)
    return true
  }

  async addlh () {
  if(!Config.getConfig('set','pz')['laheici']) return this.reply('拉黑词功能已关闭')
    if (!await this.CheckAuth()) { return true }
    let handleSentence = this.e.msg.replaceAll(/#*取消拉黑词|#*创建拉黑词/g, '').trim()
    if (!handleSentence) { return false }
    let handleWords = handleSentence.replaceAll('，', ',').split(',')
    let indexWords = []
    let existWord = []
    let folderPath = `${this.wordResPath}/`
    let wordPath = `${folderPath}${await this.getData()}.yaml`

    if (fs.existsSync(wordPath)) { indexWords = YAML.parse(fs.readFileSync(wordPath, 'utf8')) }
    for (let handleWord of handleWords) { if (indexWords.includes(handleWord)) { existWord.push(handleWord) } else { indexWords.push(handleWord) } }
    fs.writeFileSync(wordPath, YAML.stringify(indexWords, null, '\t'))
    let reMsg = `新创建拉黑词：【${handleWords.join('、')}】`
    if (existWord.length) {
      reMsg = reMsg + `\n拉黑词【${existWord.join('】【')}】已经存在`
    }
    this.reply(reMsg, true, 20)
    return true
  }
  async laheibz () {
     if(!Config.getConfig('set','pz')['laheici']) return this.reply('拉黑词功能已关闭')
    this.reply('====拉黑词帮助：\n---发送：创建拉黑词+（内容）\n只要别人触发了拉黑词，机器人就会通知你\n---发送：取消拉黑词+(内容)\n取消创建的拉黑词XX\n---发送：拉黑词列表\n查看自己创建的拉黑词有哪些\n---发送：直接拉黑\n拉黑最新的待拉黑qq号\n---发送：拉黑qq+(QQ号)\n拉黑指定qq号\n---发送：取消拉黑qq+(QQ号)\n取消拉黑指定qq号\n---发送：拉黑名单\n查看被拉黑的qq号')
  }
  async lahei(e){
  if(!Config.getConfig('set','pz')['laheici']) return this.reply('拉黑词功能已关闭')
    if (!e.isMaster) return e.reply(" 该命令仅限主人可用", true);
    if (kk==0) return
    //获取qq号
    let qq ={}
    if(l==1){
     qq = kk
    }
    let data = getread()
    //为空处理
    if (!data.blackQQ) data.blackQQ = [];
    //判断是否有这个QQ
    if (data.blackQQ.indexOf(Number(qq)) != -1) {
      return e.reply("这个小可爱已经在黑名单里面了哦~")
    };
   //添加qq
    data.blackQQ.push(Number(qq))
  //发送消息
    if (getwrite(data)) {
      e.reply(` 已将${qq}加入黑名单~`)
  } else {
    e.reply(` ERROR`)
  }
  }
  //添加黑名单qq
  async lhQQ(e) {
  if(!Config.getConfig('set','pz')['laheici']) {return this.reply('拉黑词功能已关闭')}
    if (!e.isMaster) return e.reply(" 该命令仅限主人可用", true);
    //获取qq号
    let qq = e.message[0].text.replace(/#|拉黑(qq|QQ)/g, "").trim()
    //判断是否at
    if (e.message[1]) {
      qq = e.message[1].qq
    } else {
      qq = qq.match(/[1-9]\d*/g)
    }
    //判断qq号是否正确
    if (!qq) return e.reply(" 请输入正确的QQ号")
    //读取
    let data = getread()
      //为空处理
      if (!data.blackQQ) data.blackQQ = [];
      //判断是否有这个QQ
      if (data.blackQQ.indexOf(Number(qq)) != -1) {
        return e.reply("这个小可爱已经在黑名单里面了哦~")
      };
     //添加qq
      data.blackQQ.push(Number(qq))
    //发送消息
      if (getwrite(data)) {
        e.reply(` 已将${qq}加入黑名单~`)
    } else {
      e.reply(` ERROR`)
    }
  }

  async getData () {
    return `编辑拉黑词`
  }
  async quxiao (e) {
  if(!Config.getConfig('set','pz')['laheici']) {return this.reply('拉黑词功能已关闭')}
    if (!e.isMaster) return e.reply("你不是主人，不能听你的", true);
    //获取qq号
    let qq = e.message[0].text.replace(/#|取消拉黑(qq|QQ)/g, "").trim()
    //判断是否at
    if (e.message[1]) {
      qq = e.message[1].qq
    } else {
      qq = qq.match(/[1-9]\d*/g)
    }
    //判断qq号是否正确
    if (!qq) return e.reply(" 请输入正确的QQ号")
    //读取
    let data = getread()
      //为空处理
      if (!data.blackQQ) data.blackQQ = [];
      //判断是否有这个QQ
     if (data.blackQQ.indexOf(Number(qq)) != -1) {
      data.blackQQ.splice(data.blackQQ.indexOf(Number(qq)), 1)//位置索引，删除1个
      }else{
      e.reply('这个人不在黑名单里呀~')
      return true
      }

    //发送消息
      if (getwrite(data)) {
        e.reply(` 已将${qq}取消黑名单~`)
    } else {
      e.reply( 'ERROR')
    }
  }
  
 async laheimd (e){
 if(!Config.getConfig('set','pz')['laheici']) {return this.reply('拉黑词功能已关闭')}
 if (!e.isMaster) return e.reply("你不是主人，不能听你的", true);
 let data = getread()
 let msg = ['没有被拉黑的小可爱哟~']
 if(data.blackQQ){
 data.blackQQ.map((v,i)=>{
 msg[0]='以下是被拉黑的QQ\n'
 msg.push(`${i+1},${v}\n`)
 })
 }
 let forwardMsg = {
      message: msg,
      nickname: Bot.nickname,
      user_id: Bot.uin
    }

    if (e.isGroup) {
      forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    }
forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title color="#777777" size="26">(˃ ⌑ ˂ഃ )拉黑QQ名单</title>`)
    //发送消息
    e.reply(forwardMsg)
 }
  
}

/** 读取 */
function getread() {
  try {
    var fileContents = fs.readFileSync(path, 'utf8');
  } catch (e) {
    console.log(e);
    return false;
  }
  //转换
  return YAML.parse(fileContents);
}

/** 写入 */
function getwrite(data) {
  try {
    //转换
    let yaml = YAML.stringify(data);
    fs.writeFileSync(path, yaml, 'utf8');
    return true
  } catch (e) {
    //错误处理
    console.log(e);
    return false
  }
}
