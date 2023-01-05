import plugin from '../../../lib/plugins/plugin.js'
import fs from 'fs'
import YAML from 'yaml'




let path='./plugins/hs-qiqi-plugin/resources/禁言.yaml'

if (!fs.existsSync(path)) {fs.writeFileSync(path,'')}

export class ztwd extends plugin {
    constructor() {
        super({
            name: '禁言',
            dsc: '',
            event: 'message.group',
            priority: 1145,
            rule: [
                {
                    reg: '^(闭嘴?|放开?)$',
                    fnc: 'bz',
                },
                {
                    reg: '',
                    fnc: 'jt',
					log: false
                },
            ]
        })
   }
    async z(e) {
  if (!e.isMaster) 
  {
    e.reply('你几把谁啊，我要见的我主人')
    return true
}
      let data=await getread()
      if (!data) data= [];
      let atItem = e.message.filter((item) => item.type === "at");
      let A = atItem[0].qq;
      if (data.indexOf(A) == -1&&e.msg.includes('闭嘴')){
     await data.push(A)
     await e.reply(`好的主人从现在开始让(${A})闭嘴`)
      }
      if (data.indexOf(A)!== -1&&e.msg.includes('放开')){
     await data.splice(data.indexOf(A), 1)
     await e.reply(`好吧,放开(${A})`)
      }
      getwrite(data)
}
async t(e) {
   let used = await getread()
   let op = e.user_id
   try {
        for (let Q of used) {
          if(op == Q &&!e.isMaster){
            if(e.img){
              let pp;
              pp = (await e.group.getChatHistory(e.img.seq, 1)).pop();
              await e.group.recallMsg(pp.message_id);
              return true;
              }
              if(e.msg){
              let pp;
              pp = (await e.group.getChatHistory(e.message_id.seq, 1)).pop();
              await e.group.recallMsg(pp.message_id);
              return true;
          }
      }else{
          return false
          }
        }
      } catch (e) {
      return false
      }
      return false
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