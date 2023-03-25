import plugin from '../../lib/plugins/plugin.js'
import fs from "fs";
import { exec,execSync } from 'child_process'
import { Restart } from '../other/restart.js'
let path=process.cwd()+'/plugins/hs-qiqi-plugin/'

export class xzfy extends plugin {
constructor() {
super({
 name: '卸载枫叶',
 dsc: '一键删除枫叶插件',
 event: 'message',
 priority: -999999999999999999999999999999999999999999,
rule: [
      	{
        	reg: '^#卸载枫叶$',
            fnc: 'xz'
         }
         ]
  })
 }

async xz(e) {
 if (!e.isMaster) {return e.reply('只有主人可以操作')}
    if (fs.existsSync(path)) {
     let a= await execSync('rm -rf plugins/hs-qiqi-plugin');
 if(a.error){
 e.reply('卸载失败~请手动尝试')
     return true
  }
 await e.reply('枫叶插件已经彻底卸载成功，恭喜你已经删除了Yunzai届最大的bug，以后再接再厉噢~')
 setTimeout(() => new Restart(this.e).restart(), 600)
     return true
         }else{
    	e.reply('小黑子,我都没有找到hs-qiqi-plugin,没装我怎么卸载')
  }
	return true
    }
}
