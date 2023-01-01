import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import gsCfg from '../../genshin/model/gsCfg.js'
import fs from 'fs'
import YAML from 'yaml'
import { Common } from '../components/index.js'
import uploadRecord from '../../hs-qiqi-plugin/model/uploadRecord.js'

const _path = process.cwd();

let 语音=''
let 名字=''

export class fy_yy extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '[枫叶]原神角色语音',
      /** 功能描述 */
      dsc: '',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 110,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^(.*)语音$',
          /** 执行方法 */
          fnc: 'ysyy'
        },{
          /** 命令正则匹配 */
          reg: '^(.*)语音列表$',
          /** 执行方法 */
          fnc: 'yylb'
        },{
          /** 命令正则匹配 */
          reg: '^#?高清语音(开启|关闭)$',
          /** 执行方法 */
          fnc: 'kg'
        },{
          /** 命令正则匹配 */
          reg: '',
          /** 执行方法 */
          fnc: 'jc'
        }
        
      ]
    })
  }
  async kg (e){
  if (!e.isMaster) 
  {return false}
if(e.msg.includes('开')){
await redis.set('fy_gqyy','1')
await e.reply('好的，已开启^')
return true
}else{
await redis.del('fy_gqyy')
await e.reply('好的，关闭了^')
return true
}
}

  async ysyy (e) {
      e.msg = e.msg.replace(/语音/g,'')
      if(e.msg.includes('日文')||e.msg.includes('日语')||e.msg.includes('日本')){
      语音='日文'
      名字=e.msg.replace(/日文|日语|日本/g,'')
      }else if(e.msg.includes('韩语')||e.msg.includes('韩文')||e.msg.includes('韩国')){
      语音='韩文'
      名字=e.msg.replace(/韩文|韩语|韩国/g,'')
      }else if(e.msg.includes('英语')||e.msg.includes('英文')||e.msg.includes('外国')){
      语音='英文'
      名字=e.msg.replace(/英文|英语|外国/g,'')
      }else{
      语音='中文'
      名字=e.msg
      }
        //为其他有语音的匹配正则插件考虑
              e.msg=e.msg+'语音'
        let 别名 = {}
        //调用云崽的别名配置
        别名 = gsCfg.getRole(名字)
        if(别名.name != undefined & 别名.name != "主角"){
            名字 = 别名.name
        }else{
        return false
        }
     //处理数据
     let 路径 =_path+'/plugins/hs-qiqi-plugin/resources/原神全语音/'+名字+'.yaml'
     let 读取 = fs.readFileSync(路径, 'utf8');
     let 数据= YAML.parse(读取);
     //生成随机
     let i=Math.ceil(Math.random() * 数据.简述.length)-1;
     
     let 简述=数据.简述[i]
     let 详细=数据.详细[i]
     if(语音=='中文'){
     语音=数据.中文[i]
     }
     if(语音=='韩文'){
     语音=数据.韩文[i]
     }
     if(语音=='日文'){
     语音=数据.日文[i]
     }
     if(语音=='英文'){
     语音=数据.英文[i]
     }
    let gq=await redis.get('fy_gqyy')
    let sf=''
    if(!gq){
    sf='当前未开始高清语音模式,pc端也能正常听语音'
    }else{ 
    sf='已开启高清语音模式，pc端无法听取高清语音'
    }
    
     //渲染数据
    let data = {
    tplFile: `./plugins/hs-qiqi-plugin/resources/yy/yy.html`,
    toux: _path+`/plugins/hs-qiqi-plugin/resources/角色头像/${名字}.webp`,
    名字:名字,
    简述:简述,
    详细:详细,
    sf:sf,
    dz: process.cwd()
    }
    await Common.render('yy/yy', {
		...data
	}, { e, scale: 2 });
	
	 if(gq){
      e.reply(await uploadRecord(`${语音}.mp3`,0,false))
           }else{
      e.reply(await segment.record(`${语音}.mp3`))
            }

    return true;
  }
  
  
  async yylb (e) {
  let qq = e.user_id
  let 名字 = e.msg.replace(/语音列表/g,'')
  let 别名 = {}
        //调用云崽的别名配置
        别名 = gsCfg.getRole(名字)
        if(别名.name != undefined & 别名.name != "主角"){
            名字 = 别名.name
        }else{
        return false
        }
  let 路径 =_path+'/plugins/hs-qiqi-plugin/resources/原神全语音/'+名字+'.yaml'
     let 读取 = fs.readFileSync(路径, 'utf8');
     let 数据= YAML.parse(读取);
     let 简述=数据.简述
     
  let gq=await redis.get('fy_gqyy')
    let sf=''
    if(!gq){
    sf='当前未开始高清语音模式,pc端也能正常听语音'
    }else{ 
    sf='已开启高清语音模式，pc端无法听取高清语音'
    }
    
     //渲染数据
    let data = {
    tplFile: `./plugins/hs-qiqi-plugin/resources/yy/lb.html`,
    toux: _path+`/plugins/hs-qiqi-plugin/resources/角色头像/${名字}.webp`,
    名字:名字,
    简述:简述,
    sf:sf,
    dz: process.cwd()
    }   
  await Common.render('yy/lb', {
		...data
	}, { e, scale: 2 });
	
  await redis.set(`fy_yy:${qq}`,名字.toString(),{ //写入缓存值
    EX:61
  });
  
  }
  
  
  async jc (e) {
  if(e.msg && e.msg.length>5){
     return false
  }
  let 名字=await redis.get(`fy_yy:${e.user_id}`)
  if(名字){
  let 序号=await (/\d+/g).exec(e.msg)
  if(!序号){return false}
  if(e.msg.includes('日文')||e.msg.includes('日语')){
      语音='日文'
  }else if(e.msg.includes('中文')||e.msg.includes('汉语')){
  语音='中文'
  }else if(e.msg.includes('英语')||e.msg.includes('英文')||e.msg.includes('外语')){
  语音='英文'
  }else if(e.msg.includes('韩语')||e.msg.includes('韩文')){
   语音='韩文'
  }else if(/^([0-9]|[0-9][0-9]|[1][0-9][0-9])$/.test(this.e.msg)){
   语音='中文'
  }else{ return false}
  
  let 路径 =_path+'/plugins/hs-qiqi-plugin/resources/原神全语音/'+名字+'.yaml'
     let 读取 = fs.readFileSync(路径, 'utf8');
     let 数据= YAML.parse(读取);
     let i=序号-1
     
     let 简述=数据.简述[i]
     let 详细=数据.详细[i]
     if(序号>数据.简述.length){return e.reply('emmm...序号不对吧？')}
     if(语音=='中文'){
     语音=数据.中文[i]
     }
     if(语音=='韩文'){
     语音=数据.韩文[i]
     }
     if(语音=='日文'){
     语音=数据.日文[i]
     }
     if(语音=='英文'){
     语音=数据.英文[i]
     }
    let gq=await redis.get('fy_gqyy')
    let sf=''
    if(!gq){
    sf='当前未开始高清语音模式,pc端也能正常听语音'
    }else{ 
    sf='已开启高清语音模式，pc端无法听取高清语音'
    }
    
     //渲染数据
    let data = {
    tplFile: `./plugins/hs-qiqi-plugin/resources/yy/yy.html`,
    toux: _path+`/plugins/hs-qiqi-plugin/resources/角色头像/${名字}.webp`,
    名字:名字,
    简述:简述,
    详细:详细,
    sf:sf,
    dz: process.cwd()
    }
    await Common.render('yy/yy', {
		...data
	}, { e, scale: 2 });
	
	 if(gq){
      e.reply(await uploadRecord(`${语音}.mp3`,0,false))
           }else{
      e.reply(await segment.record(`${语音}.mp3`))
            }
    return true;
  }else{
  return false
  }
}  
}


