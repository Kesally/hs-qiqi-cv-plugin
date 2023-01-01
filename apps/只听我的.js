import plugin from '../../../lib/plugins/plugin.js'
import fs from 'fs'
import YAML from 'yaml'




let path='./plugins/hs-qiqi-plugin/config/只听我的_群号.yaml'

if (!fs.existsSync(path)) {fs.writeFileSync(path,'')}

export class ztwd extends plugin {
    constructor() {
        super({
            name: '[枫叶]只听我的',
            dsc: '',
            event: 'message.group',
            priority: -99999999,
            rule: [
                {
                    reg: '^#?(只?听我的|听大家的?)$',
                    fnc: 'z',
                },
                {
                    reg: '',
                    fnc: 't',
                },
            ]
        })
   }
    async z(e) {
  if (!e.isMaster) 
  {return e.reply('你是坏人！')}
      let data=await getread()
      if (!data) data= [];
      if (data.indexOf(e.group_id) == -1&&e.msg.includes('听我的')){
     await data.push(e.group_id)
     await e.reply('好的主人，在这个群里我只听你的~')
      }
      if (data.indexOf(e.group_id)!== -1&&e.msg.includes('听大家')){
     await data.splice(data.indexOf(e.group_id), 1)//位置索引，删除1个
     await e.reply('嗯~可以和大家一起玩咯')
      }
      getwrite(data)
}
async t(e) {
   let group = await getread()
   try {
        for (let qqq of group) {
          if(e.group_id == qqq &&!e.isMaster){
           return true
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