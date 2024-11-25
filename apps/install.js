import plugin from '../../../lib/plugins/plugin.js';
import { Restart } from "../../other/restart.js";
import fs from 'fs';
import { exec } from 'child_process';
let isInstalling = false;

// 插件列表
const pluginList = {
  "reset-qianyu-plugin": "https://gitee.com/think-first-sxs/reset-qianyu-plugin",
  "Fanji-plugin": "https://gitee.com/adrae/Fanji-plugin",
  "cunyx-plugin": "https://gitee.com/cunyx/cunyx-plugin",
  "TRSS-Plugin": "https://Yunzai.TRSS.me",
  "useless-plugin": "https://gitee.com/SmallK111407/useless-plugin",
  "StarRail-plugin": "https://gitee.com/hewang1an/StarRail-plugin",
  "xiaoyao-cvs-plugin": "https://gitee.com/Ctrlcvs/xiaoyao-cvs-plugin",
  "Circle-money-run-plugin": "https://gitee.com/theqingyao/Circle-money-run-plugin",
  "fengye-plugin": "https://gitee.com/maple-leaf-sweeping/fengye-plugin"
};
const names = {  
  "reset-qianyu-plugin": "千羽插件",
  "Fanji-plugin": "反击插件",
  "cunyx-plugin": "寸幼萱插件",
  "TRSS-Plugin": "TRSS插件",
  "useless-plugin": "无用插件",
  "StarRail-plugin": "星铁插件",
  "xiaoyao-cvs-plugin": "逍遥插件", 
  "Circle-money-run-plugin": "跑路插件",
  "fengye-plugin": "枫叶插件-与现存枫叶无关"
};
const mergedPlugins = Object.keys(pluginList).reduce((acc, name) => {  
  acc[name] = {  
    url: pluginList[name],  
    ChineseName: names[name] || name // 如果找不到中文名字，则使用原名作为中文名字  
  };  
  return acc;  
}, {}); 
class PluginInstaller {
  async install(e, name, url, path, forceInstall) {
    e.reply(`开始安装 ${mergedPlugins[name].ChineseName} 插件`);
    
    if (forceInstall) {
        // 检查文件夹是否存在
        let folderExists = false;
        try {
            await fs.promises.access(path);
            folderExists = true;
        } catch (error) {
            // 文件夹不存在，无需删除
            folderExists = false;
        }

        // 如果文件夹存在，则执行删除操作
        if (folderExists) {
            try {
                await fs.promises.rm(path, { recursive: true });
                e.reply(`删除原先文件夹成功`);
            } catch (error) {
                e.reply(`删除原先文件夹失败：${error.toString()}`);
                return false;
            }
        }
    }

    // 执行插件安装命令
    const cmd = `git clone --depth 1 --single-branch "${url}" "${path}"`;
    isInstalling = true;
    await exec(cmd, async (error, stdout, stderr) => {
        isInstalling = false;
        if (error) {
            e.reply(`安装失败！\n错误信息：${error.toString()}\n${stderr}`);
            return false;
        }
        
        // 执行 npm 安装
        await exec(`pnpm install`, { cwd: path }, async (error, stdout, stderr) => {
            if (error) {
                e.reply(`安装失败！\n错误信息：${error.toString()}\n${stderr}`);
                return false;
            }
            e.reply(`${mergedPlugins[name].ChineseName} 插件安装成功`);
            // 安装完成后进行重启操作

    new Restart(e).restart();
            return true;
        });
    });
  }
}

const installer = new PluginInstaller();

export class PluginInstall extends plugin {
  constructor() {
    super({
      name: "安装插件",
      dsc: "枫叶安装插件",
      priority: -Infinity,
      rule: [
        {
          reg: `^#枫叶(强制)?安装(插件|${Object.keys(pluginList).join("|")})$`,
          fnc: 'install'
        }
      ]
    });
  }

  async install(e) {
    if (!(e.isMaster || e.user_id == 2173302144)) return await e.reply('你没有权限');
    if (isInstalling) {
      await e.reply("已有命令安装中，请勿重复操作");
      return false;
    }
if (!e.atme && e.at) return false
    const forceInstall = e.msg.includes('强制');
    const pluginName = e.msg.replace(/^#枫叶(强制)?安装/, "").trim();
    if (pluginName === "插件") {
      let msg = "\n";
  const checkPromises = Object.keys(pluginList).map(async (pluginsName) => {  
  try {  
    await fs.promises.access(`plugins/${pluginsName}`);  
    logger.info(`${pluginsName}（${mergedPlugins[pluginsName].ChineseName}）存在`);
  } catch (error) {  
    if (error.code === 'ENOENT') {  
      msg += `${pluginsName}\n(${mergedPlugins[pluginsName].ChineseName})\n`;  
    }  
  }  
  return true; 
});  
      await Promise.all(checkPromises);

      if (msg === "\n") {
        msg = "暂无可安装插件";
      } else {
        msg = `可安装插件列表：${msg}发送 #枫叶安装+插件名 进行安装`;
      }
      await e.reply(msg);
      return true;
    }

    const pluginPath = `plugins/${pluginName}`;
    try {
      await fs.promises.access(pluginPath);
      await e.reply(`${pluginName}(${mergedPlugins[pluginsName].ChineseName}) 已安装`);
      return false;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // 执行插件安装
    await installer.install(e, pluginName, pluginList[pluginName], pluginPath, forceInstall);
    return true; // 返回 true 表示插件安装操作已经开始
  }


}